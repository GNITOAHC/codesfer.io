<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { LogOut } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import {
		getSession,
		clearSession,
		logout,
		logoutSession,
		me,
		listObjects,
		removeObject,
		type Account,
		type StoredObject
	} from '$lib/api';
	import LoginCard from './LoginCard.svelte';
	import UploadSection from './UploadSection.svelte';
	import FileList from './FileList.svelte';
	import SessionList from './SessionList.svelte';

	let account = $state<Account | null>(null);
	let objects = $state<StoredObject[]>([]);
	let loading = $state(true);
	let error = $state('');

	async function load() {
		loading = true;
		error = '';
		try {
			[account, objects] = await Promise.all([me(), listObjects()]);
		} catch (e) {
			clearSession();
			account = null;
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function handleLogout() {
		await logout();
		account = null;
		objects = [];
	}

	async function handleRemove(key: string) {
		if (!confirm(`Delete "${key}"? This cannot be undone.`)) return;
		try {
			await removeObject(key);
			objects = objects.filter((o) => o.key !== key);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function handleRevoke(name: string) {
		if (!confirm(`Log out session "${name}"?`)) return;
		try {
			await logoutSession(name);
			if (account) {
				account.sessions = account.sessions.filter((s) => s.name !== name);
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function refreshObjects() {
		try {
			objects = await listObjects();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	onMount(() => {
		if (getSession()) {
			load();
		} else {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Dashboard - Codesfer</title>
</svelte:head>

{#if loading}
	<p class="py-16 text-center text-sm text-muted-foreground">Loading...</p>
{:else if !account}
	<LoginCard onsuccess={load} />
{:else}
	<div class="flex flex-col gap-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-semibold">{account.username}</h1>
				<p class="text-sm text-muted-foreground">{account.email}</p>
			</div>
			<Button variant="ghost" size="sm" onclick={handleLogout} class="gap-2">
				<LogOut class="h-4 w-4" />
				Sign out
			</Button>
		</div>

		{#if error}
			<p class="text-sm text-destructive">{error}</p>
		{/if}

		<UploadSection onuploaded={refreshObjects} />
		<FileList {objects} onremove={handleRemove} />
		<SessionList sessions={account.sessions} onrevoke={handleRevoke} />
	</div>
{/if}
