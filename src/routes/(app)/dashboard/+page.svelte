<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { LogOut } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { removeObject, logoutSession } from '$lib/api';
	import LoginCard from './LoginCard.svelte';
	import UploadSection from './UploadSection.svelte';
	import FileList from './FileList.svelte';
	import SessionList from './SessionList.svelte';

	let { data, form } = $props();

	let error = $state('');

	async function handleRemove(key: string) {
		if (!confirm(`Delete "${key}"? This cannot be undone.`)) return;
		try {
			await removeObject(key);
			await invalidateAll();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function handleRevoke(name: string) {
		if (!confirm(`Log out session "${name}"?`)) return;
		try {
			await logoutSession(name);
			await invalidateAll();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}
</script>

<svelte:head>
	<title>Dashboard - Codesfer</title>
</svelte:head>

{#if !data.account}
	<LoginCard error={form?.error ?? ''} />
{:else}
	<div class="flex flex-col gap-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-semibold">{data.account.username}</h1>
				<p class="text-sm text-muted-foreground">{data.account.email}</p>
			</div>
			<form method="POST" action="?/logout" use:enhance>
				<Button type="submit" variant="ghost" size="sm" class="gap-2">
					<LogOut class="h-4 w-4" />
					Sign out
				</Button>
			</form>
		</div>

		{#if error}
			<p class="text-sm text-destructive">{error}</p>
		{/if}

		<UploadSection onuploaded={invalidateAll} />
		<FileList objects={data.objects} onremove={handleRemove} />
		<SessionList sessions={data.account.sessions} onrevoke={handleRevoke} />
	</div>
{/if}
