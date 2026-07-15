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

	function emit(list: FileList | null | undefined) {
		const files = [...(list ?? [])];
		if (files.length === 0) return;
		onfiles(multiple ? files : files.slice(0, 1));
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
		if (!disabled) emit(e.dataTransfer?.files);
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
		emit(e.currentTarget.files);
		e.currentTarget.value = '';
	}}
/>
