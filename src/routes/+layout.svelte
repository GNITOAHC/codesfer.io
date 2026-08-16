<script>
	import './layout.css';
	import favicon from '$lib/assets/terminal.svg';
	import { page } from '$app/state';
	let { children } = $props();

	// Origin is hardcoded, never taken from the request: www.codesfer.io must
	// canonicalise to the apex rather than to itself. The query string is
	// dropped so URLs carrying tracking parameters point at the clean page.
	const canonical = $derived(`https://codesfer.io${page.url.pathname}`);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={canonical} />
	<!-- Same value as the canonical, by construction: the two must never drift. -->
	<meta property="og:url" content={canonical} />
</svelte:head>

<main class="flex flex-1 flex-col">
	{@render children()}
</main>
