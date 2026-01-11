<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Home, BookOpen } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{$page.status} - {$page.error?.message || 'Error'} | Codesfer</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="max-w-2xl text-center">
		<div
			class="mb-6 bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-8xl font-bold text-transparent md:text-9xl"
		>
			{$page.status}
		</div>
		<h1 class="mb-4 text-3xl font-bold md:text-4xl">
			{$page.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
		</h1>
		<p class="mb-8 text-lg text-muted-foreground">
			{$page.status === 404
				? "The page you're looking for doesn't exist or has been moved."
				: 'An unexpected error occurred. Please try again later.'}
		</p>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<Button href={base || '/'} class="gap-2">
				<Home class="h-4 w-4" />
				Go Home
			</Button>
			<Button variant="outline" href={`${base}/docs`} class="gap-2">
				<BookOpen class="h-4 w-4" />
				Documentation
			</Button>
		</div>
	</div>
</div>
