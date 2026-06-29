<script>
	import './layout.css';
	import favicon from '$lib/assets/terminal.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="flex flex-1 flex-col">
	{@render children()}
</main>
