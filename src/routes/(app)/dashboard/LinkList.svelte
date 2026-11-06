<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Check, Copy, Trash2 } from '@lucide/svelte';
	import type { ShortURL } from '$lib/api';

	interface Props {
		links: ShortURL[];
		onremove: (handle: string) => void;
	}

	let { links, onremove }: Props = $props();

	let copiedHandle = $state('');
	let copiedTimer: ReturnType<typeof setTimeout>;

	async function copyLink(link: ShortURL) {
		await navigator.clipboard.writeText(link.custom_url ?? link.url);
		copiedHandle = link.handle;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copiedHandle = ''), 2000);
	}

	function formatDate(unixSeconds: number): string {
		return new Date(unixSeconds * 1000).toLocaleString();
	}
</script>

<section class="flex flex-col gap-3">
	<h2 class="text-sm font-medium text-muted-foreground">Short links</h2>
	{#if links.length === 0}
		<p
			class="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground"
		>
			No short links yet.
		</p>
	{:else}
		<div class="overflow-x-auto rounded-md border border-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border text-left text-muted-foreground">
						<th class="px-4 py-2 font-medium">Link</th>
						<th class="px-4 py-2 font-medium">Target</th>
						<th class="px-4 py-2 font-medium">Created</th>
						<th class="px-4 py-2"></th>
					</tr>
				</thead>
				<tbody>
					{#each links as link (link.handle)}
						<tr class="border-b border-border last:border-b-0">
							<td class="px-4 py-2">
								<span class="flex items-center gap-2 font-mono">
									<a href={link.custom_url ?? link.url} class="hover:underline">
										{link.custom_url ?? link.url}
									</a>
									{#if link.protected}
										<Badge variant="secondary">protected</Badge>
									{/if}
								</span>
							</td>
							<td class="max-w-xs truncate px-4 py-2 text-muted-foreground" title={link.target}>
								{link.target}
							</td>
							<td class="px-4 py-2 text-muted-foreground">{formatDate(link.created_at)}</td>
							<td class="px-4 py-2 text-right whitespace-nowrap">
								<Button
									variant="ghost"
									size="sm"
									onclick={() => copyLink(link)}
									aria-label={copiedHandle === link.handle ? 'Link copied' : 'Copy short link'}
								>
									{#if copiedHandle === link.handle}
										<Check class="h-4 w-4 text-green-600" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</Button>
								<span class="sr-only" aria-live="polite">
									{copiedHandle === link.handle ? 'Link copied to clipboard' : ''}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => onremove(link.handle)}
									aria-label="Delete short link"
								>
									<Trash2 class="h-4 w-4 text-destructive" />
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
