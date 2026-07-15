// Client for the codesfer Go server (github.com/gnitoahc/codesfer,
// internal/server package). Two access paths, chosen by where the code runs:
//
// - Browser code never talks to the Go server directly and never sees the
//   session: it calls the same-origin /api proxy
//   (src/routes/api/[...path]/+server.ts), which injects the Authorization
//   header from the httpOnly `session` cookie. Everything below that uses
//   request() follows this path.
// - Server code (+page.server.ts load/actions) talks to the Go server
//   directly via API_BASE with an explicit Authorization header.
//
// Upload semantics intentionally mirror the CLI (`codesfer push`,
// internal/cli + internal/client in the server repo): payloads are zip
// archives, paths are sanitized the same way, metadata carries the file tree,
// and files over 90 MB switch to chunked upload. Keep the two in sync — the
// server assumes CLI conventions.
//
// The types mirror pkg/api in the server repo.

import { createZip } from '$lib/zip';

// Go server base URL. Used server-side (load functions, /api proxy) and for
// the public /download links on the share page. Baked in at build time;
// set VITE_API_BASE to override (e.g. a local server during development,
// or a self-hosted instance).
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? 'https://api.codesfer.io';

export interface AccountSession {
	name: string;
	location: string;
	agent: string;
	last_seen: number;
	created_at: number;
	current: boolean;
}

export interface Account {
	email: string;
	username: string;
	sessions: AccountSession[];
}

export interface StoredObject {
	key?: string;
	path: string;
	password?: string;
	created_at: number;
	meta?: Record<string, string>;
}

export type AccessScope = 'owner' | 'authenticated' | 'public';

export interface ObjectInfo {
	key: string;
	owner: string;
	path: string;
	created_at: number;
	protected: boolean;
	access_scope: AccessScope;
	metadata?: Record<string, unknown>;
}

// Client-side requests go through the same-origin /api proxy, which attaches
// the Authorization header from the httpOnly session cookie.
async function request(path: string, init: RequestInit = {}): Promise<Response> {
	const res = await fetch(`/api${path}`, init);
	if (!res.ok) throw new Error((await res.text()) || res.statusText);
	return res;
}

export async function removeObject(key: string): Promise<void> {
	await request(`/storage/remove?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
}

export async function logoutSession(target: string): Promise<void> {
	await request(`/auth/logout?target=${encodeURIComponent(target)}`, { method: 'POST' });
}

// Dashboard download: same-origin, streamed through the /api proxy so the
// Authorization header is attached server-side.
export function downloadHref(key: string, password = ''): string {
	const qs = new URLSearchParams({ key });
	if (password) qs.set('password', password);
	return `/api/storage/download?${qs}`;
}

// Shareable link, resolved against the current origin by callers.
export function sharePath(key: string): string {
	return `/d/${encodeURIComponent(key)}`;
}

// Public download from the Go server's /download route (used on the share page).
export function publicDownloadUrl(key: string, password = ''): string {
	const suffix = password ? `?password=${encodeURIComponent(password)}` : '';
	return `${API_BASE}/download/${encodeURIComponent(key)}.zip${suffix}`;
}

export interface UploadResult {
	uid: string;
	path: string;
}

// Mirrors internal/cli.sanitizePath: paths may only contain A-Z a-z 0-9 _ - /
export function sanitizePath(p: string): string {
	return p.replace(/[^A-Za-z0-9_\-/]/g, '');
}

// Match the CLI: chunks stay under Cloudflare's 100 MB request-body limit.
const CHUNK_SIZE = 90 << 20; // 90 MB

// Mirrors client.generateUploadID: random 8-byte hex string.
function generateUploadId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(8));
	return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function setPushFields(form: FormData, path: string, password: string, meta: string, access: AccessScope) {
	if (path) form.set('path', path);
	if (password) form.set('password', password);
	if (access !== 'public') form.set('access', access);
	form.set('meta', meta);
}

// Mirrors `codesfer push <file>`: wrap the file in a zip archive (the server
// stores and serves zips), derive the object path from the sanitized filename,
// and attach the file-tree metadata used by /storage/info.
export async function uploadFile(
	file: File,
	password = '',
	onProgress?: (done: number, total: number) => void,
	access: AccessScope = 'public'
): Promise<UploadResult> {
	const path = sanitizePath(file.name);
	const meta = JSON.stringify({ tree: [file.name] });
	const zip = await createZip([{ name: file.name, data: file, lastModified: file.lastModified }]);

	if (zip.size <= CHUNK_SIZE) {
		const form = new FormData();
		form.set('file', zip, `${path || 'upload'}.zip`);
		setPushFields(form, path, password, meta, access);
		onProgress?.(0, 1);
		const res = await request('/storage/upload', { method: 'POST', body: form });
		onProgress?.(1, 1);
		return res.json();
	}

	const totalChunks = Math.ceil(zip.size / CHUNK_SIZE);
	const uploadId = generateUploadId();
	let res: Response | undefined;
	for (let i = 0; i < totalChunks; i++) {
		const form = new FormData();
		form.set('upload_id', uploadId);
		form.set('chunk_index', String(i));
		form.set('total_chunks', String(totalChunks));
		form.set('file', zip.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE), `chunk_${i}`);
		setPushFields(form, path, password, meta, access);
		res = await request('/storage/upload/chunk', { method: 'POST', body: form });
		onProgress?.(i + 1, totalChunks);
	}
	return res!.json();
}
