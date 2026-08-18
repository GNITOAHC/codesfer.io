// Self-check for the source fallback: run with `bun src/lib/server/install-scripts.test.ts`.
// ponytail: no test framework, this is the only branch worth pinning.
import { serveInstallScript } from './install-scripts';

// ponytail: local asserts, repo has no @types/node and this needs no dep
const assert = {
	equal(actual: unknown, expected: unknown) {
		if (actual !== expected) throw new Error(`expected ${expected}, got ${actual}`);
	},
	match(actual: string, re: RegExp) {
		if (!re.test(actual)) throw new Error(`${actual} does not match ${re}`);
	}
};

const realFetch = globalThis.fetch;
const stub = (reply: (url: string) => Response | Promise<Response>) => {
	const seen: string[] = [];
	globalThis.fetch = (async (input: RequestInfo | URL) => {
		const url = String(input);
		seen.push(url);
		return reply(url);
	}) as typeof fetch;
	return seen;
};

// raw 429s (GitHub rate limit) -> jsDelivr serves it, user still gets a script
{
	const seen = stub((url) =>
		url.includes('raw.githubusercontent.com')
			? new Response('429: Too Many Requests', { status: 429 })
			: new Response('#!/bin/sh\n')
	);
	const res = await serveInstallScript('install.sh');
	assert.equal(res.status, 200);
	assert.equal(await res.text(), '#!/bin/sh\n');
	assert.equal(seen.length, 2);
	assert.match(seen[1], /jsdelivr/);
}

// raw throws (network error) -> still falls through, no unhandled rejection
{
	stub((url) => {
		if (url.includes('raw.githubusercontent.com')) throw new Error('boom');
		return new Response('# ps1\n');
	});
	const res = await serveInstallScript('install.ps1');
	assert.equal(res.status, 200);
}

// both down -> 502, same as before
{
	stub(() => new Response('nope', { status: 500 }));
	const res = await serveInstallScript('install.sh');
	assert.equal(res.status, 502);
}

globalThis.fetch = realFetch;
console.log('ok');
