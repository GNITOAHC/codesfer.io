import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { API_BASE, publicDownloadUrl, type ObjectInfo } from '$lib/api';

export const prerender = false;

// User-Agent prefix, not an `Accept: */*` check — some link unfurlers
// (facebookexternalhit, Twitterbot) also send `*/*` and would get the
// zip instead of the og: tags. Widen the regex if other CLIs need it.
const CLI_AGENT = /^(curl|wget|httpie|aria2|libcurl)/i;

export const load: PageServerLoad = async ({ params, url, fetch, cookies, request }) => {
	const password = url.searchParams.get('password') ?? '';

	// `curl -OJL /d/<key>` gets the file itself; browsers get the share page.
	if (CLI_AGENT.test(request.headers.get('user-agent') ?? '')) {
		redirect(302, publicDownloadUrl(params.key, password));
	}

	const qs = new URLSearchParams({ key: params.key });
	if (password) qs.set('password', password);
	const infoUrl = `${API_BASE}/storage/info?${qs}`;

	// Forward the dashboard session so the Go server can identify the viewer
	// (owner bypass, authenticated-scope files).
	const session = cookies.get('session');
	let res = await fetch(infoUrl, {
		headers: session ? { Authorization: `Bearer ${session}` } : {}
	});

	// A stale session cookie is rejected by the auth middleware before the
	// gate check (401 without a `gate` field) — retry anonymously so public
	// files still load.
	if (res.status === 401 && session) {
		const body = (await res
			.clone()
			.json()
			.catch(() => null)) as { gate?: string } | null;
		if (!body?.gate) res = await fetch(infoUrl);
	}

	// Gated object: `gate` says which prompt to show (sign-in or password).
	if (res.status === 401 || res.status === 403) {
		const body = (await res.json().catch(() => null)) as { gate?: string } | null;
		const gate = body?.gate === 'auth' ? ('auth' as const) : ('password' as const);
		return {
			key: params.key,
			info: null,
			password: '',
			wrongPassword: gate === 'password' && password !== '',
			gate
		};
	}
	if (res.status === 404) error(404, 'file not found');
	if (!res.ok) error(res.status, (await res.text()) || 'failed to load file info');

	return {
		key: params.key,
		info: (await res.json()) as ObjectInfo,
		password,
		wrongPassword: false,
		gate: null
	};
};
