<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { X } from '@lucide/svelte';
	import type { AccountSession } from '$lib/api';

	interface Props {
		sessions: AccountSession[];
		onrevoke: (name: string) => void;
	}

	let { sessions, onrevoke }: Props = $props();

	function formatDate(unixSeconds: number): string {
		return new Date(unixSeconds * 1000).toLocaleString();
	}
</script>

<section class="flex flex-col gap-3">
	<h2 class="text-sm font-medium text-muted-foreground">Sessions</h2>
	<div class="rounded-md border border-border">
		{#each sessions as session (session.name)}
			<div
				class="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0"
			>
				<div class="min-w-0">
					<p class="flex items-center gap-2 text-sm">
						<span class="font-mono">{session.name}</span>
						{#if session.current}
							<Badge>current</Badge>
						{/if}
					</p>
					<p class="truncate text-xs text-muted-foreground">
						{session.location || 'unknown location'} · {session.agent || 'unknown agent'}
					</p>
				</div>
				<div class="flex shrink-0 items-center gap-2">
					<p class="text-xs text-muted-foreground">
						last seen {formatDate(session.last_seen)}
					</p>
					{#if !session.current}
						<Button
							variant="ghost"
							size="sm"
							onclick={() => onrevoke(session.name)}
							aria-label="Log out session {session.name}"
						>
							<X class="h-4 w-4 text-destructive" />
						</Button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>
