<script lang="ts">
	import { Upload } from '@lucide/svelte';

	interface Props {
		onfiles: (files: File[]) => void;
		multiple?: boolean;
		disabled?: boolean;
		label?: string;
	}

	let {
		onfiles,
		multiple = false,
		disabled = false,
		label = 'Drop files here or click to browse'
	}: Props = $props();

	let dragging = $state(false);
	let input = $state<HTMLInputElement>();

	function emit(files: File[]) {
		if (files.length === 0) return;
		onfiles(multiple ? files : files.slice(0, 1));
	}

	// A dropped folder shows up in dataTransfer.files as an unreadable
	// pseudo-file, so walk the entry tree instead. Files are renamed to their
	// path relative to the drop ("proj/src/a.go"), the same layout the CLI's
	// CompressFiles writes into the zip.
	async function walk(entry: FileSystemEntry): Promise<File[]> {
		if (entry.isFile) {
			const file = await new Promise<File>((res, rej) =>
				(entry as FileSystemFileEntry).file(res, rej)
			);
			const name = entry.fullPath.replace(/^\//, '');
			return [new File([file], name, { type: file.type, lastModified: file.lastModified })];
		}
		const reader = (entry as FileSystemDirectoryEntry).createReader();
		const children: FileSystemEntry[] = [];
		// readEntries returns batches (100 at a time in Chrome) until empty.
		for (;;) {
			const batch = await new Promise<FileSystemEntry[]>((res, rej) =>
				reader.readEntries(res, rej)
			);
			if (batch.length === 0) break;
			children.push(...batch);
		}
		return (await Promise.all(children.map(walk))).flat();
	}

	async function emitDrop(transfer: DataTransfer | null) {
		// Entries must be grabbed synchronously: the item list is cleared once
		// the drop handler yields.
		const entries = [...(transfer?.items ?? [])]
			.map((item) => item.webkitGetAsEntry())
			.filter((e) => e !== null);
		emit((await Promise.all(entries.map(walk))).flat());
	}
</script>

<button
	type="button"
	{disabled}
	class="flex w-full flex-col items-center gap-2 rounded-md border border-dashed px-4 py-8 text-sm text-muted-foreground transition-colors hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50 {dragging
		? 'border-primary bg-accent/50'
		: 'border-border'}"
	onclick={() => input?.click()}
	ondragover={(e) => {
		e.preventDefault();
		if (!disabled) dragging = true;
	}}
	ondragleave={() => (dragging = false)}
	ondrop={(e) => {
		e.preventDefault();
		dragging = false;
		if (!disabled) emitDrop(e.dataTransfer);
	}}
>
	<Upload class="h-5 w-5" />
	{label}
</button>

<input
	type="file"
	class="hidden"
	bind:this={input}
	{multiple}
	onchange={(e) => {
		emit([...(e.currentTarget.files ?? [])]);
		e.currentTarget.value = '';
	}}
/>
