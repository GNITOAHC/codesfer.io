// Serves the CLI install scripts from the codesfer server repo at request
// time, replacing the old GitHub Pages workflow that baked them into static/
// at deploy time. Always tracks main; the cache-control header lets
// Cloudflare's edge cache absorb repeat traffic.

const SOURCE = 'https://raw.githubusercontent.com/GNITOAHC/codesfer/main/scripts';

export async function serveInstallScript(name: 'install.sh' | 'install.ps1'): Promise<Response> {
	const res = await fetch(`${SOURCE}/${name}`);
	if (!res.ok) {
		return new Response('install script temporarily unavailable', { status: 502 });
	}
	return new Response(res.body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=300'
		}
	});
}
