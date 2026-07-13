<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { login } from '$lib/api';

	interface Props {
		onsuccess: () => void;
	}

	let { onsuccess }: Props = $props();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loggingIn = $state(false);

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		loggingIn = true;
		error = '';
		try {
			await login(email, password);
			password = '';
			onsuccess();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loggingIn = false;
		}
	}
</script>

<div class="mx-auto max-w-sm py-16">
	<Card.Root>
		<Card.Header>
			<Card.Title>Sign in</Card.Title>
			<Card.Description>Access your uploaded files</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="flex flex-col gap-4" onsubmit={handleLogin}>
				<label class="flex flex-col gap-1.5 text-sm">
					Email
					<input
						type="email"
						bind:value={email}
						required
						class="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				</label>
				<label class="flex flex-col gap-1.5 text-sm">
					Password
					<input
						type="password"
						bind:value={password}
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
