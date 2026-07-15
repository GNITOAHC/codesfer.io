<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Terminal as TerminalIcon, Download, Lock } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { publicDownloadUrl } from '$lib/api';

	let { data } = $props();

	const title = $derived(data.info?.path ?? 'Protected file');
	const description = $derived(
		data.info
			? `Shared by ${data.info.owner} via Codesfer`
			: '🔒 Password protected · Shared via Codesfer'
	);
	const tree = $derived((data.info?.metadata?.tree as string[] | undefined) ?? []);

	function formatDate(unixSeconds: number): string {
		return new Date(unixSeconds * 1000).toLocaleString();
	}
</script>

<svelte:head>
	<title>{title} - Codesfer</title>
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="border-b border-border">
		<div class="container mx-auto flex h-14 items-center px-4">
			<a href={resolve('/')} class="flex items-center gap-2 font-semibold">
				<TerminalIcon class="h-5 w-5 text-primary" />
				<span>Codesfer</span>
			</a>
		</div>
	</header>

	<main class="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
		<Card.Root class="w-full max-w-sm">
			{#if data.info}
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						{data.info.path}
						{#if data.info.protected}
							<Badge variant="secondary">protected</Badge>
						{/if}
					</Card.Title>
					<Card.Description>
						Shared by {data.info.owner} · {formatDate(data.info.created_at)}
					</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					{#if tree.length > 0}
						<ul
							class="max-h-40 overflow-y-auto rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground"
						>
							{#each tree as file (file)}
								<li class="truncate">{file}</li>
							{/each}
						</ul>
					{/if}
					<Button href={publicDownloadUrl(data.key, data.password)} class="gap-2">
						<Download class="h-4 w-4" />
						Download
					</Button>
				</Card.Content>
			{:else}
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Lock class="h-4 w-4" />
						Protected file
					</Card.Title>
					<Card.Description>This file requires a password to download.</Card.Description>
				</Card.Header>
				<Card.Content>
					<form method="GET" class="flex flex-col gap-4">
						<label class="flex flex-col gap-1.5 text-sm">
							Password
							<input
								type="password"
								name="password"
								required
								class="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
							/>
						</label>
						{#if data.wrongPassword}
							<p class="text-sm text-destructive">Wrong password, try again.</p>
						{/if}
						<Button type="submit">Unlock</Button>
					</form>
				</Card.Content>
			{/if}
		</Card.Root>
	</main>
</div>
