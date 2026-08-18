// Serves the CLI install scripts from the codesfer server repo at request
// time, replacing the old GitHub Pages workflow that baked them into static/
// at deploy time. Always tracks main; the cache-control header lets
// Cloudflare's edge cache absorb repeat traffic.
//
// raw.githubusercontent.com rate-limits unauthenticated traffic and answers
// 429 ("scraping GitHub") — Workers share egress IPs, so we hit that limit on
// other people's behalf. Two defences: cf.cacheTtl keeps the subrequest inside
// Cloudflare's cache instead of going to GitHub, and jsDelivr (a CDN, no such
// limit) backs up raw when it 429s anyway. raw stays primary because jsDelivr
// serves branch refs from a 12h cache, so it can lag main.
//
// This endpoint is the target of `curl -LsSf ... | sh`; a 502 here aborts a
// user's install, so exhaust both sources before returning one.

const SOURCES = [
	'https://raw.githubusercontent.com/GNITOAHC/codesfer/main/scripts',
	'https://cdn.jsdelivr.net/gh/GNITOAHC/codesfer@main/scripts'
];

export async function serveInstallScript(name: 'install.sh' | 'install.ps1'): Promise<Response> {
	for (const source of SOURCES) {
		const res = await fetch(`${source}/${name}`, {
			headers: { 'user-agent': 'codesfer.io' },
			cf: { cacheTtl: 300, cacheEverything: true }
		} as RequestInit).catch(() => null);
		if (!res?.ok) continue;
		return new Response(res.body, {
			headers: {
				'content-type': 'text/plain; charset=utf-8',
				'cache-control': 'public, max-age=300'
			}
		});
	}
	return new Response('install script temporarily unavailable', { status: 502 });
}
