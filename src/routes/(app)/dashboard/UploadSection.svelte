<script lang="ts">
	import { DropZone } from '$lib/components/dropzone';
	import { Button } from '$lib/components/ui/button';
	import { X } from '@lucide/svelte';
	import { uploadAnonymous, uploadFiles, type UploadResult } from '$lib/api';

	interface Props {
		onuploaded: (result: UploadResult) => void;
		// Fast upload page: no session, always public, expires after 7 days.
		anonymous?: boolean;
	}

	let { onuploaded, anonymous = false }: Props = $props();

	let pending = $state<File[]>([]);
	let uploading = $state(false);
	let status = $state('');
	let error = $state('');
	let requireSignIn = $state(false);

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		const units = ['KB', 'MB', 'GB'];
		let i = -1;
		do {
			bytes /= 1024;
			i++;
		} while (bytes >= 1024 && i < units.length - 1);
		return `${bytes.toFixed(1)} ${units[i]}`;
	}

	async function upload() {
		uploading = true;
		error = '';
		const lonePassthrough = pending.length === 1 && pending[0].name.toLowerCase().endsWith('.zip');
		status = lonePassthrough ? 'Uploading...' : 'Compressing...';
		try {
			const result = anonymous
				? await uploadAnonymous(pending)
				: await uploadFiles(
						pending,
						'',
						(done, total) => {
							status = total > 1 ? `Uploading... chunk ${done}/${total}` : 'Uploading...';
						},
						requireSignIn ? 'authenticated' : 'public'
					);
			pending = [];
			onuploaded(result);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			uploading = false;
			status = '';
		}
	}
</script>

<section class="flex flex-col gap-3">
	<h2 class="text-sm font-medium text-muted-foreground">Upload</h2>
	<DropZone
		multiple
		disabled={uploading}
		label={status || 'Drop files here or click to browse'}
		onfiles={(files) => (pending = [...pending, ...files])}
	/>
	{#if pending.length > 0}
		<ul class="flex flex-col rounded-md border border-border text-sm">
			{#each pending as file, i (i)}
				<li class="flex items-center gap-2 border-b border-border px-3 py-1.5 last:border-b-0">
					<span class="flex-1 truncate">{file.name}</span>
					<span class="text-muted-foreground">{formatSize(file.size)}</span>
					<Button
						variant="ghost"
						size="sm"
						disabled={uploading}
						onclick={() => pending.splice(i, 1)}
						aria-label="Remove {file.name}"
					>
						<X class="h-4 w-4" />
					</Button>
				</li>
			{/each}
		</ul>
	{/if}
	<div class="flex flex-wrap items-center justify-between gap-3">
		{#if anonymous}
			<p class="text-sm text-muted-foreground">
				Public link, expires in 7 days, 90 MB max. Files are zipped together.
			</p>
		{:else}
			<label class="flex items-center gap-2 text-sm text-muted-foreground">
				<input type="checkbox" bind:checked={requireSignIn} disabled={uploading} />
				Require sign-in to download
			</label>
		{/if}
		<Button size="sm" disabled={uploading || pending.length === 0} onclick={upload}>
			{uploading ? 'Uploading...' : 'Upload'}
		</Button>
	</div>
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}
</section>
