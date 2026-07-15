<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { enhance } from '$app/forms';

	interface Props {
		error?: string;
	}

	let { error = '' }: Props = $props();
	let loggingIn = $state(false);
</script>

<div class="mx-auto max-w-sm py-16">
	<Card.Root>
		<Card.Header>
			<Card.Title>Sign in</Card.Title>
			<Card.Description>Access your uploaded files</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				method="POST"
				action="?/login"
				class="flex flex-col gap-4"
				use:enhance={() => {
					loggingIn = true;
					return async ({ update }) => {
						loggingIn = false;
						await update();
					};
				}}
			>
				<label class="flex flex-col gap-1.5 text-sm">
					Email
					<input
						type="email"
						name="email"
						required
						class="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				</label>
				<label class="flex flex-col gap-1.5 text-sm">
					Password
					<input
						type="password"
						name="password"
						required
						class="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				</label>
				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}
				<Button type="submit" disabled={loggingIn}>
					{loggingIn ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
