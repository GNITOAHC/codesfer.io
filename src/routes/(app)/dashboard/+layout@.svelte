<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Terminal as TerminalIcon, Sun, Moon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		theme.initialize();
	});
</script>

<div class="flex min-h-screen flex-col">
	<header class="border-b border-border">
		<div class="container mx-auto flex h-14 items-center justify-between px-4">
			<a href={resolve('/')} class="flex items-center gap-2 font-semibold">
				<TerminalIcon class="h-5 w-5 text-primary" />
				<span>Codesfer</span>
				<span class="font-normal text-muted-foreground">/ dashboard</span>
			</a>
			<Button variant="ghost" size="sm" onclick={() => theme.toggle()} aria-label="Toggle theme">
				{#if $theme === 'dark'}
					<Sun class="h-4 w-4" />
				{:else}
					<Moon class="h-4 w-4" />
				{/if}
			</Button>
		</div>
	</header>

	<main class="container mx-auto w-full max-w-4xl flex-1 px-4 py-8">
		{@render children()}
	</main>
</div>
