import { browser } from '$app/environment';

export const API_BASE: string = import.meta.env.VITE_API_BASE ?? '';

const SESSION_KEY = 'codesfer_session';

export function getSession(): string | null {
	return browser ? localStorage.getItem(SESSION_KEY) : null;
}

export function clearSession(): void {
	localStorage.removeItem(SESSION_KEY);
}

// Mirrors pkg/api in the codesfer server repo.
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

async function request(path: string, init: RequestInit = {}): Promise<Response> {
	const session = getSession();
	const headers = new Headers(init.headers);
	if (session) headers.set('Authorization', `Bearer ${session}`);
	const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
	if (!res.ok) throw new Error((await res.text()) || res.statusText);
	return res;
}

export async function login(email: string, password: string): Promise<string> {
	const res = await request('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});
	const sessionId = await res.text();
	localStorage.setItem(SESSION_KEY, sessionId);
	return sessionId;
}

export async function logout(): Promise<void> {
	try {
		await request('/auth/logout', { method: 'POST' });
	} finally {
		clearSession();
	}
}

export async function me(): Promise<Account> {
	const session = getSession();
	if (!session) throw new Error('not logged in');
	const res = await request(`/auth/me?session_id=${encodeURIComponent(session)}`);
	return res.json();
}

export async function listObjects(): Promise<StoredObject[]> {
	const res = await request('/storage/list');
	return (await res.json()) ?? [];
}

export async function removeObject(key: string): Promise<void> {
	await request(`/storage/remove?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
}

export async function logoutSession(target: string): Promise<void> {
	await request(`/auth/logout?target=${encodeURIComponent(target)}`, { method: 'POST' });
}

export interface UploadResult {
	uid: string;
	path: string;
}

// Files larger than one chunk go through /storage/upload/chunk; R2 multipart
// requires all parts except the last to be at least 5 MiB.
const CHUNK_SIZE = 20 * 1024 * 1024;

export async function uploadFile(
	file: File,
	password = '',
	onProgress?: (done: number, total: number) => void
): Promise<UploadResult> {
	if (file.size <= CHUNK_SIZE) {
		const form = new FormData();
		form.set('file', file);
		form.set('path', file.name);
		if (password) form.set('password', password);
		onProgress?.(0, 1);
		const res = await request('/storage/upload', { method: 'POST', body: form });
		onProgress?.(1, 1);
		return res.json();
	}

	const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
	const uploadId = crypto.randomUUID();
	let res: Response | undefined;
	for (let i = 0; i < totalChunks; i++) {
		const form = new FormData();
		form.set('upload_id', uploadId);
		form.set('chunk_index', String(i));
		form.set('total_chunks', String(totalChunks));
		form.set('path', file.name);
		if (password) form.set('password', password);
		form.set('file', file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE), file.name);
		res = await request('/storage/upload/chunk', { method: 'POST', body: form });
		onProgress?.(i + 1, totalChunks);
	}
	return res!.json();
}

export function downloadUrl(key: string): string {
	return `${API_BASE}/download/${key}.zip`;
}
