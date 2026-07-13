<script lang="ts">
	import { DropZone } from '$lib/components/dropzone';
	import { uploadFile } from '$lib/api';

	interface Props {
		onuploaded: () => void;
	}

	let { onuploaded }: Props = $props();

	let uploading = $state(false);
	let status = $state('');
	let error = $state('');

	async function handleFiles(files: File[]) {
		uploading = true;
		error = '';
		try {
			for (const [idx, file] of files.entries()) {
				const prefix = files.length > 1 ? `(${idx + 1}/${files.length}) ` : '';
				await uploadFile(file, '', (done, total) => {
					status =
						total > 1
							? `${prefix}Uploading ${file.name}... chunk ${done}/${total}`
							: `${prefix}Uploading ${file.name}...`;
				});
			}
			onuploaded();
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
		onfiles={handleFiles}
	/>
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}
</section>
