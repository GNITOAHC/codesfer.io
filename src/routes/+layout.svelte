<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Button } from '$lib/components/ui/button';
	import {
		Terminal as TerminalIcon,
		Book,
		Server,
		Github,
		Menu,
		X,
		Sun,
		Moon
	} from '@lucide/svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children } = $props();
	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ href: `${base}/docs`, label: 'Documentation', icon: Book },
		{ href: `${base}/self-hosting`, label: 'Self-Hosting', icon: Server }
	];

	onMount(() => {
		theme.initialize();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<a href={base || '/'} class="flex items-center gap-2 font-semibold">
				<TerminalIcon class="h-5 w-5 text-primary" />
				<span>Codesfer</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-1 md:flex">
				{#each navLinks as link}
					<Button
						variant={$page.url.pathname.startsWith(link.href) ? 'secondary' : 'ghost'}
						size="sm"
						href={link.href}
						class="gap-2"
					>
						<link.icon class="h-4 w-4" />
						{link.label}
					</Button>
				{/each}
				<div class="mx-2 h-4 w-px bg-border"></div>
				<Button variant="ghost" size="sm" href="https://github.com/GNITOAHC/codesfer" class="gap-2">
					<Github class="h-4 w-4" />
					GitHub
				</Button>
				<Button variant="ghost" size="sm" onclick={() => theme.toggle()} aria-label="Toggle theme">
					{#if $theme === 'dark'}
						<Sun class="h-4 w-4" />
					{:else}
						<Moon class="h-4 w-4" />
					{/if}
				</Button>
			</nav>

			<!-- Mobile Menu Button -->
			<div class="flex items-center gap-1 md:hidden">
				<Button variant="ghost" size="sm" onclick={() => theme.toggle()} aria-label="Toggle theme">
					{#if $theme === 'dark'}
						<Sun class="h-5 w-5" />
					{:else}
						<Moon class="h-5 w-5" />
					{/if}
				</Button>
				<Button variant="ghost" size="sm" onclick={() => (mobileMenuOpen = !mobileMenuOpen)}>
					{#if mobileMenuOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
				</Button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="border-t border-border bg-background md:hidden">
				<nav class="container mx-auto flex flex-col gap-1 px-4 py-4">
					{#each navLinks as link}
						<Button
							variant={$page.url.pathname.startsWith(link.href) ? 'secondary' : 'ghost'}
							href={link.href}
							class="w-full justify-start gap-2"
							onclick={() => (mobileMenuOpen = false)}
						>
							<link.icon class="h-4 w-4" />
							{link.label}
						</Button>
					{/each}
					<Button
						variant="ghost"
						href="https://github.com/GNITOAHC/codesfer"
						class="w-full justify-start gap-2"
					>
						<Github class="h-4 w-4" />
						GitHub
					</Button>
				</nav>
			</div>
		{/if}
	</header>

	<!-- Main Content -->
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-border bg-muted/30">
		<div class="container mx-auto px-4 py-8">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div class="flex items-center gap-2 text-sm text-muted-foreground">
					<TerminalIcon class="h-4 w-4" />
					<span>Codesfer - Secure code sharing from your terminal</span>
				</div>
				<div class="flex items-center gap-4">
					<a
						href="https://github.com/GNITOAHC/codesfer"
						class="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						GitHub
					</a>
					<a
						href={`${base}/docs`}
						class="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Docs
					</a>
					<a
						href={`${base}/self-hosting`}
						class="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Self-Hosting
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
