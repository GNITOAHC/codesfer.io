<script lang="ts">
	import { onMount } from 'svelte';

	interface TerminalLine {
		type: 'command' | 'output';
		text: string;
		delay?: number;
	}

	interface Props {
		lines?: TerminalLine[];
		title?: string;
		typeSpeed?: number;
	}

	let {
		lines = [
			{ type: 'command', text: 'codesfer push main.go -k my-snippet --pass secret' },
			{ type: 'output', text: '> Uploading...' },
			{ type: 'output', text: '> ID: my-snippet' },
			{ type: 'output', text: '> Path: main.go' }
		],
		title = 'Terminal',
		typeSpeed = 30
	}: Props = $props();

	let displayedLines: { type: 'command' | 'output'; text: string }[] = $state([]);
	let currentLineIndex = $state(0);
	let currentCharIndex = $state(0);
	let isTyping = $state(true);

	onMount(() => {
		const typeNextChar = () => {
			if (currentLineIndex >= lines.length) {
				isTyping = false;
				return;
			}

			const currentLine = lines[currentLineIndex];

			if (currentCharIndex === 0) {
				displayedLines = [...displayedLines, { type: currentLine.type, text: '' }];
			}

			if (currentCharIndex < currentLine.text.length) {
				displayedLines = displayedLines.map((line, i) =>
					i === currentLineIndex
						? { ...line, text: currentLine.text.slice(0, currentCharIndex + 1) }
						: line
				);
				currentCharIndex++;
				setTimeout(typeNextChar, currentLine.type === 'command' ? typeSpeed : typeSpeed / 2);
			} else {
				currentLineIndex++;
				currentCharIndex = 0;
				setTimeout(typeNextChar, currentLine.delay ?? 200);
			}
		};

		setTimeout(typeNextChar, 500);
	});
</script>

<div class="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
	<div class="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
		<div class="flex gap-1.5">
			<div class="h-3 w-3 rounded-full bg-red-500"></div>
			<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
			<div class="h-3 w-3 rounded-full bg-green-500"></div>
		</div>
		<span class="ml-2 text-xs text-muted-foreground">{title}</span>
	</div>
	<div class="bg-[#1e1e1e] p-4 font-mono text-sm">
		{#each displayedLines as line, i}
			<div class="leading-relaxed">
				{#if line.type === 'command'}
					<span class="text-amber-400">$</span>
					<span class="text-gray-200"> {line.text}</span>
					{#if i === currentLineIndex - 1 || (i === displayedLines.length - 1 && isTyping && line.type === 'command')}
						<span class="animate-pulse text-gray-200">|</span>
					{/if}
				{:else}
					<span class="text-gray-400">{line.text}</span>
				{/if}
			</div>
		{/each}
		{#if displayedLines.length === 0}
			<div class="leading-relaxed">
				<span class="text-amber-400">$</span>
				<span class="animate-pulse text-gray-200">|</span>
			</div>
		{/if}
	</div>
</div>
