<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Copy, Download, Trash2 } from '@lucide/svelte';
	import { downloadHref, sharePath, type StoredObject } from '$lib/api';

	interface Props {
		objects: StoredObject[];
		onremove: (key: string) => void;
	}

	let { objects, onremove }: Props = $props();

	function copyLink(key: string) {
		navigator.clipboard.writeText(new URL(sharePath(key), location.href).href);
	}

	function formatDate(unixSeconds: number): string {
		return new Date(unixSeconds * 1000).toLocaleString();
	}
</script>

<section class="flex flex-col gap-3">
	<h2 class="text-sm font-medium text-muted-foreground">Files</h2>
	{#if objects.length === 0}
		<p
			class="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground"
		>
			No files uploaded yet.
		</p>
	{:else}
		<div class="overflow-x-auto rounded-md border border-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border text-left text-muted-foreground">
						<th class="px-4 py-2 font-medium">Name</th>
						<th class="px-4 py-2 font-medium">Key</th>
						<th class="px-4 py-2 font-medium">Created</th>
						<th class="px-4 py-2"></th>
					</tr>
				</thead>
				<tbody>
					{#each objects as obj (obj.key)}
						<tr class="border-b border-border last:border-b-0">
							<td class="px-4 py-2">
								<span class="flex items-center gap-2">
									{obj.path}
									{#if obj.password}
										<Badge variant="secondary">protected</Badge>
									{/if}
								</span>
							</td>
							<td class="px-4 py-2 font-mono text-muted-foreground">{obj.key}</td>
							<td class="px-4 py-2 text-muted-foreground">{formatDate(obj.created_at)}</td>
							<td class="px-4 py-2 text-right whitespace-nowrap">
								<Button
									variant="ghost"
									size="sm"
									href={downloadHref(obj.key ?? '', obj.password ?? '')}
									aria-label="Download file"
								>
									<Download class="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => copyLink(obj.key ?? '')}
									aria-label="Copy share link"
								>
									<Copy class="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => onremove(obj.key ?? '')}
									aria-label="Delete file"
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
