<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Terminal } from '$lib/components/terminal';
	import { Lock, Database, Monitor, Eye, Download, ArrowRight } from '@lucide/svelte';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Codesfer - Share code snippets securely from your terminal</title>
	<meta
		name="description"
		content="A CLI tool and self-hostable server for sending and receiving code with optional encryption."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0 -z-10 bg-linear-to-b from-primary/5 to-transparent"></div>
	<div class="container mx-auto px-4 py-18 md:py-32">
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
				Share code snippets securely from your terminal.
			</h1>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
				A CLI tool and self-hostable server for sending and receiving code with optional encryption.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button size="lg" href="https://github.com/GNITOAHC/codesfer/releases" class="gap-2">
					<Download class="h-4 w-4" />
					Download Binary
				</Button>
				<Button size="lg" variant="outline" href={`${base}/docs`} class="gap-2">
					Get Started
					<ArrowRight class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Terminal Demo Section -->
<section class="container mx-auto px-4 pb-16">
	<div class="mx-auto max-w-3xl">
		<Terminal
			title="codesfer"
			lines={[
				{ type: 'command', text: 'codesfer push main.go -k my-snippet --pass secret' },
				{ type: 'output', text: '> Uploading...', delay: 300 },
				{ type: 'output', text: '> ID: my-snippet', delay: 100 },
				{ type: 'output', text: '> Path: main.go', delay: 100 }
			]}
		/>
	</div>
</section>

<!-- Features Grid Section -->
<section class="container mx-auto px-4 py-16">
	<div class="mb-12 text-center">
		<h2 class="mb-4 text-3xl font-bold">Features</h2>
		<p class="mx-auto max-w-2xl text-muted-foreground">
			Everything you need to share code securely and efficiently.
		</p>
	</div>
	<div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
		<Card class="transition-shadow hover:shadow-lg">
			<CardHeader>
				<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<Lock class="h-5 w-5 text-primary" />
				</div>
				<CardTitle>Encrypted Sharing</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-muted-foreground">
					AES/Password protection support. Compresses files into a zip, encrypts if requested, and
					uploads to your server.
				</p>
			</CardContent>
		</Card>

		<Card class="transition-shadow hover:shadow-lg">
			<CardHeader>
				<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<Database class="h-5 w-5 text-primary" />
				</div>
				<CardTitle>Backend Agnostic</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-muted-foreground">
					Supports SQLite for local storage or Cloudflare R2 for cloud object storage. Choose what
					fits your needs.
				</p>
			</CardContent>
		</Card>

		<Card class="transition-shadow hover:shadow-lg">
			<CardHeader>
				<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<Monitor class="h-5 w-5 text-primary" />
				</div>
				<CardTitle>Cross-Platform</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-muted-foreground">
					Available for Windows, Linux, and macOS. Download the binary for your platform and get
					started immediately.
				</p>
			</CardContent>
		</Card>

		<Card class="transition-shadow hover:shadow-lg">
			<CardHeader>
				<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<Eye class="h-5 w-5 text-primary" />
				</div>
				<CardTitle>Web Preview</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-muted-foreground">
					The server detects preview bots (Discord, Slack) and serves Open Graph metadata for rich
					link previews.
				</p>
			</CardContent>
		</Card>
	</div>
</section>

<!-- CTA Section -->
<section class="container mx-auto px-4 py-16">
	<div class="mx-auto max-w-3xl rounded-2xl bg-card p-8 text-center shadow-lg md:p-12">
		<h2 class="mb-4 text-2xl font-bold md:text-3xl">Ready to get started?</h2>
		<p class="mb-8 text-muted-foreground">
			Download the CLI, self-host your server, or read the documentation.
		</p>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<Button href={`${base}/docs`}>Read Documentation</Button>
			<Button variant="outline" href={`${base}/self-hosting`}>Self-Hosting Guide</Button>
		</div>
	</div>
</section>
