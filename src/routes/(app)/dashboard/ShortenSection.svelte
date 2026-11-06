<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { createShortURL, createShortURLAnonymous, type ShortURL } from '$lib/api';

	interface Props {
		oncreated: (link: ShortURL) => void;
		// Shorten page: no session, no custom name or password, expires after 7 days.
		anonymous?: boolean;
	}

	let { oncreated, anonymous = false }: Props = $props();

	let target = $state('');
	let custom = $state('');
	let password = $state('');
	let creating = $state(false);
	let error = $state('');

	const inputClass =
		'h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

	async function create(e: SubmitEvent) {
		e.preventDefault();
		creating = true;
		error = '';
		try {
			const link = anonymous
				? await createShortURLAnonymous(target)
				: await createShortURL(target, custom, password);
			target = custom = password = '';
			oncreated(link);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			creating = false;
		}
	}
</script>

<section class="flex flex-col gap-3">
	<h2 class="text-sm font-medium text-muted-foreground">Shorten a link</h2>
	<form class="flex flex-col gap-3" onsubmit={create}>
		<input
			type="url"
			bind:value={target}
			required
			placeholder="https://example.com/a/very/long/link"
			aria-label="Link to shorten"
			disabled={creating}
			class={inputClass}
		/>
		{#if !anonymous}
			<div class="grid gap-3 sm:grid-cols-2">
				<!-- Same rule as the server's customPattern. -->
				<input
					bind:value={custom}
					pattern={'[A-Za-z][A-Za-z0-9_]{2,31}'}
					title="Start with a letter; 3-32 letters, digits or underscores"
					placeholder="Custom name (optional)"
					aria-label="Custom name"
					disabled={creating}
					class={inputClass}
				/>
				<input
					type="password"
					bind:value={password}
					autocomplete="new-password"
					placeholder="Password (optional)"
					aria-label="Password"
					disabled={creating}
					class={inputClass}
				/>
			</div>
		{/if}
		<div class="flex flex-wrap items-center justify-between gap-3">
			{#if anonymous}
				<p class="text-sm text-muted-foreground">
					Expires in 7 days. Sign in for permanent, custom or password-protected links.
				</p>
			{:else}
				<span></span>
			{/if}
			<Button type="submit" size="sm" disabled={creating || !target}>
				{creating ? 'Shortening...' : 'Shorten'}
			</Button>
		</div>
	</form>
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}
</section>
