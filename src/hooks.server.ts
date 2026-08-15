import type { Handle } from '@sveltejs/kit';

// Static and prerendered responses get these from the _headers file at the
// project root, applied by Cloudflare's assets layer. That layer never sees
// server-rendered responses (/d/<key>, /dashboard, the API proxy), so they are
// set again here. Keep the two lists identical.
//
// Referrer-Policy is the one that carries real weight: without it, clicking an
// outbound link from a share page sends the full /d/<key> URL — which contains
// the secret key — in the Referer header.
//
// No preload token on HSTS, and the domain is not submitted to the preload
// list. That step is effectively irreversible; it waits until the header has
// run in production for a month without incident.
const SECURITY_HEADERS: Record<string, string> = {
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'X-Frame-Options': 'DENY'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(name, value);
	}
	return response;
};
