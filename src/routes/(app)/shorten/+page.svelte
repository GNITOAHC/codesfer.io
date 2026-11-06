<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Check, Copy } from '@lucide/svelte';
	import type { ShortURL } from '$lib/api';
	import ShortenSection from '../dashboard/ShortenSection.svelte';

	let result = $state<ShortURL | null>(null);
	let copied = $state(false);
	let copiedTimer: ReturnType<typeof setTimeout>;

	async function copyLink() {
		await navigator.clipboard.writeText(result!.url);
		copied = true;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>Shorten a Link - Codesfer</title>
	<meta
		name="description"
		content="Shorten any link instantly without an account. Get a short link that expires in 7 days."
	/>
</svelte:head>

<div class="container mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
	<div>
		<h1 class="text-2xl font-semibold">Shorten a link</h1>
		<p class="text-sm text-muted-foreground">
			No account needed. Also available as <code class="font-mono"
				>codesfer url new &lt;url&gt;</code
			>.
		</p>
	</div>

	<ShortenSection anonymous oncreated={(r) => (result = r)} />

	{#if result}
		<section class="flex flex-col gap-2 rounded-md border border-border p-4">
			<h2 class="text-sm font-medium text-muted-foreground">Shortened</h2>
			<div class="flex items-center gap-2">
				<a href={result.url} class="flex-1 truncate font-mono text-sm hover:underline"
					>{result.url}</a
				>
				<Button
					variant="ghost"
					size="sm"
					onclick={copyLink}
					aria-label={copied ? 'Link copied' : 'Copy short link'}
				>
					{#if copied}
						<Check class="h-4 w-4 text-green-600" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</Button>
				<span class="sr-only" aria-live="polite">{copied ? 'Link copied to clipboard' : ''}</span>
			</div>
			<p class="truncate text-sm text-muted-foreground" title={result.target}>
				→ {result.target}{#if result.expires_at}
					· expires {new Date(result.expires_at * 1000).toLocaleString()}{/if}
			</p>
		</section>
	{/if}
</div>
