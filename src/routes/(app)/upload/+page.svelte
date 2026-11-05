<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Check, Copy } from '@lucide/svelte';
	import { sharePath, type UploadResult } from '$lib/api';
	import UploadSection from '../dashboard/UploadSection.svelte';

	let result = $state<UploadResult | null>(null);
	let copied = $state(false);
	let copiedTimer: ReturnType<typeof setTimeout>;

	const link = $derived(result ? new URL(sharePath(result.uid), location.href).href : '');

	async function copyLink() {
		await navigator.clipboard.writeText(link);
		copied = true;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>Fast Upload - Codesfer</title>
	<meta
		name="description"
		content="Share files instantly without an account. Drop files, get a public link that expires in 7 days."
	/>
</svelte:head>

<div class="container mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
	<div>
		<h1 class="text-2xl font-semibold">Fast upload</h1>
		<p class="text-sm text-muted-foreground">
			No account needed. Fetch it later with <code class="font-mono">codesfer pull &lt;key&gt;</code
			>.
		</p>
	</div>

	<UploadSection anonymous onuploaded={(r) => (result = r)} />

	{#if result}
		<section class="flex flex-col gap-2 rounded-md border border-border p-4">
			<h2 class="text-sm font-medium text-muted-foreground">Uploaded</h2>
			<div class="flex items-center gap-2">
				<a href={link} class="flex-1 truncate font-mono text-sm hover:underline">{link}</a>
				<Button
					variant="ghost"
					size="sm"
					onclick={copyLink}
					aria-label={copied ? 'Link copied' : 'Copy share link'}
				>
					{#if copied}
						<Check class="h-4 w-4 text-green-600" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</Button>
				<span class="sr-only" aria-live="polite">{copied ? 'Link copied to clipboard' : ''}</span>
			</div>
			<p class="text-sm text-muted-foreground">
				Key <span class="font-mono">{result.uid}</span>{#if result.expires_at}
					· expires {new Date(result.expires_at * 1000).toLocaleString()}{/if}
			</p>
		</section>
	{/if}
</div>
