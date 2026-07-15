// Same-origin proxy to the Go server: /api/<path> → ${API_BASE}/<path>.
//
// Exists so that browser code can call authenticated Go endpoints without
// ever holding the session ID: the session lives in an httpOnly cookie (set
// by the login action in src/routes/(app)/dashboard/+page.server.ts), and
// this proxy translates it into the `Authorization: Bearer` header the Go
// server expects. It also makes dashboard downloads same-origin.
//
// Bodies stream through in both directions (90 MB upload chunks, arbitrarily
// large downloads) — nothing is buffered in memory, so on adapter-node the
// BODY_SIZE_LIMIT env var must be raised above the chunk size.
//
// Only the whitelisted paths below are reachable; everything else 404s so
// this can't be used as an open relay to arbitrary Go routes (e.g. login,
// which must go through the cookie-setting action instead).

import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { API_BASE } from '$lib/api';

export const prerender = false;

const ALLOWED_PREFIXES = ['storage/'];
const ALLOWED_PATHS = ['auth/logout'];

const proxy: RequestHandler = async ({ params, request, url, cookies }) => {
	const path = params.path;
	if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p)) && !ALLOWED_PATHS.includes(path)) {
		error(404, 'not found');
	}

	const session = cookies.get('session');
	// Mutating routes all require auth on the Go server. Rejecting early also
	// avoids aborting a streamed request body mid-flight, which Node's fetch
	// reports as a generic network error instead of the upstream 401.
	if (!session && request.method !== 'GET') {
		error(401, 'not signed in');
	}

	const headers = new Headers();
	const contentType = request.headers.get('content-type');
	if (contentType) headers.set('content-type', contentType);
	if (session) headers.set('authorization', `Bearer ${session}`);

	let res: Response;
	try {
		res = await fetch(`${API_BASE}/${path}${url.search}`, {
			method: request.method,
			headers,
			body: request.body,
			// @ts-expect-error Node's fetch requires half-duplex for streamed request bodies
			duplex: 'half'
		});
	} catch {
		error(502, 'upstream server unavailable');
	}

	const responseHeaders = new Headers();
	for (const name of ['content-type', 'content-disposition', 'content-length']) {
		const value = res.headers.get(name);
		if (value) responseHeaders.set(name, value);
	}

	// /storage/download sends a bare filename without the .zip extension the
	// archive actually has; mirror the public DownloadRoute and append it.
	const disposition = responseHeaders.get('content-disposition');
	if (disposition && res.ok && path === 'storage/download') {
		const filename = disposition.match(/filename="?([^";]*)"?/)?.[1];
		if (filename && !filename.endsWith('.zip')) {
			responseHeaders.set('content-disposition', `attachment; filename="${filename}.zip"`);
		}
	}

	return new Response(res.body, { status: res.status, headers: responseHeaders });
};

export const GET = proxy;
export const POST = proxy;
export const DELETE = proxy;
