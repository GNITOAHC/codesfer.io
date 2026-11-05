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

export type AccessScope = 'owner' | 'authenticated' | 'public';

export interface StoredObject {
	key?: string;
	path: string;
	password?: string;
	created_at: number;
	access_scope: AccessScope;
	meta?: Record<string, string>;
}

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

// Access is two independent gates: `access_scope` (who) and `protected` (what
// they must know). The Go server's public /download route runs without the
// auth middleware, so it judges every caller as anonymous — a link to it only
// works when neither gate needs a session: public scope, and the password
// either absent or in hand. Notably an owner passes /storage/info by bypass
// but is still anonymous to /download, which is what made the button 401.
export function canDownloadAnonymously(info: ObjectInfo, password = ''): boolean {
	return info.access_scope === 'public' && (!info.protected || password !== '');
}

// The one download link for the share page: direct when the object is
// anonymously reachable, otherwise through the /api proxy, which turns the
// httpOnly session cookie into the Authorization header the Go server needs.
export function objectDownloadUrl(info: ObjectInfo, key: string, password = ''): string {
	return canDownloadAnonymously(info, password)
		? publicDownloadUrl(key, password)
		: downloadHref(key, password);
}

export interface UploadResult {
	uid: string;
	path: string;
	expires_at?: number;
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

function setPushFields(
	form: FormData,
	path: string,
	password: string,
	meta: string,
	access: AccessScope
) {
	if (path) form.set('path', path);
	if (password) form.set('password', password);
	if (access !== 'public') form.set('access', access);
	form.set('meta', meta);
}

function isZip(file: File): boolean {
	return file.name.toLowerCase().endsWith('.zip');
}

// Mirrors `codesfer push <files...>`: bundle every file into one zip archive
// (the server stores and serves zips), derive the object path from the
// sanitized filename, and attach the file-tree metadata used by
// /storage/info. A lone .zip is sent as-is instead of being zipped again.
async function bundle(files: File[]): Promise<{ zip: Blob; path: string; meta: string }> {
	const meta = JSON.stringify({ tree: files.map((f) => f.name) });
	if (files.length === 1 && isZip(files[0])) {
		const base = files[0].name.split('/').pop()!;
		return { zip: files[0], path: sanitizePath(base.slice(0, -4)), meta };
	}
	// ponytail: duplicate names across drops aren't deduped; the zip keeps both entries.
	const zip = await createZip(
		files.map((f) => ({ name: f.name, data: f, lastModified: f.lastModified }))
	);
	// Like the CLI: a single file or folder names the object, several fall back
	// to a generic name. Files from a dropped folder are named "folder/...".
	const roots = new Set(files.map((f) => f.name.split('/')[0]));
	const path = roots.size === 1 ? sanitizePath([...roots][0]) : 'upload';
	return { zip, path, meta };
}

export async function uploadFiles(
	files: File[],
	password = '',
	onProgress?: (done: number, total: number) => void,
	access: AccessScope = 'public'
): Promise<UploadResult> {
	const { zip, path, meta } = await bundle(files);

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

// Anonymous upload (see anon_upload_guide.md in the server repo): posted
// straight to the Go server, bypassing the /api proxy, so no session is ever
// attached and the server's per-IP rate limit sees the visitor's real IP.
// Always public, 7-day expiry, single request only (no chunking without login).
export async function uploadAnonymous(files: File[]): Promise<UploadResult> {
	const { zip, path, meta } = await bundle(files);
	if (zip.size > CHUNK_SIZE) {
		throw new Error('Anonymous uploads are limited to 90 MB; sign in for larger uploads');
	}
	const form = new FormData();
	form.set('file', zip, `${path || 'upload'}.zip`);
	setPushFields(form, path, '', meta, 'public');
	const res = await fetch(`${API_BASE}/storage/upload`, { method: 'POST', body: form });
	if (!res.ok) throw new Error((await res.text()) || res.statusText);
	return res.json();
}
