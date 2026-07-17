import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { API_BASE, type Account, type StoredObject } from '$lib/api';

export const prerender = false;

const COOKIE = 'session';
const COOKIE_OPTS = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	secure: !dev,
	maxAge: 60 * 60 * 24 * 30
} as const;

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const session = cookies.get(COOKIE);
	if (!session) return { account: null, objects: [] as StoredObject[] };

	const auth = { Authorization: `Bearer ${session}` };
	const [meRes, listRes] = await Promise.all([
		fetch(`${API_BASE}/auth/me?session_id=${encodeURIComponent(session)}`, { headers: auth }),
		fetch(`${API_BASE}/storage/list`, { headers: auth })
	]);

	if (!meRes.ok || !listRes.ok) {
		cookies.delete(COOKIE, { path: '/' });
		return { account: null, objects: [] as StoredObject[] };
	}

	return {
		account: (await meRes.json()) as Account,
		objects: ((await listRes.json()) ?? []) as StoredObject[]
	};
};

export const actions: Actions = {
	login: async ({ request, cookies, fetch }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
			return fail(400, { error: 'email and password are required' });
		}

		const res = await fetch(`${API_BASE}/auth/login`, {
			method: 'POST',
			// Workers subrequests drop the User-Agent; the Go server reads this
			// header as a fallback to record the session's agent.
			headers: { 'X-Forwarded-User-Agent': request.headers.get('user-agent') ?? '' },
			body: JSON.stringify({ email, password })
		});
		if (!res.ok) {
			return fail(res.status, { error: (await res.text()) || 'login failed' });
		}

		cookies.set(COOKIE, await res.text(), COOKIE_OPTS);

		// Only same-origin paths ("/..." but not "//host") to prevent open redirects.
		const target = form.get('redirect');
		if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')) {
			redirect(303, target);
		}
	},
	logout: async ({ cookies, fetch }) => {
		const session = cookies.get(COOKIE);
		if (session) {
			await fetch(`${API_BASE}/auth/logout`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${session}` }
			}).catch(() => {});
		}
		cookies.delete(COOKIE, { path: '/' });
	}
};
