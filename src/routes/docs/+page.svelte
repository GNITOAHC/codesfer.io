<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	// prettier-ignore
	import { Download, UserPlus, LogIn, LogOut, Upload, FolderDown, List, Trash2, BookOpen, Shield, Terminal as TerminalIcon } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Documentation - Codesfer</title>
	<meta name="description" content="Learn how to install and use Codesfer CLI." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden border-b">
	<div class="absolute inset-0 -z-10 bg-linear-to-b from-primary/5 to-transparent"></div>
	<div class="container mx-auto px-4 py-16">
		<div class="mx-auto max-w-4xl text-center">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
			>
				<BookOpen class="h-4 w-4" />
				Documentation
			</div>
			<h1 class="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Get Started with Codesfer</h1>
			<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
				Everything you need to know to install and use the Codesfer CLI for secure code sharing.
			</p>
		</div>
	</div>
</section>

<div class="container mx-auto px-4 py-12">
	<div class="mx-auto max-w-5xl">
		<!-- Installation Section -->
		<section class="mb-20">
			<div class="mb-8">
				<h2 class="mb-3 flex items-center gap-3 text-3xl font-bold">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Download class="h-5 w-5 text-primary" />
					</div>
					Installation
				</h2>
				<p class="text-muted-foreground">
					Choose your preferred installation method to get started.
				</p>
			</div>

			<Card class="border-2">
				<CardContent>
					<Tabs value="shell">
						<TabsList class="mb-4">
							<TabsTrigger value="shell">Shell/Powershell</TabsTrigger>
							<TabsTrigger value="homebrew">Homebrew</TabsTrigger>
							<TabsTrigger value="releases">Releases</TabsTrigger>
							<TabsTrigger value="source">Source</TabsTrigger>
						</TabsList>

						<TabsContent value="shell">
							<div class="space-y-6">
								<div>
									<div class="mb-2 flex items-center gap-2">
										<Badge variant="secondary">Recommended for Linux</Badge>
										<span class="text-sm text-muted-foreground">Also available for macOS</span>
									</div>
									<div class="rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm">
										<code class="block">curl -LsSf https://www.codesfer.io/install.sh | sh</code>
										<code class="block text-muted-foreground"># or using wget</code>
										<code class="block">wget -qO- https://www.codesfer.io/install.sh | sh</code>
									</div>
								</div>
								<div>
									<div class="mb-2">
										<Badge variant="secondary">Recommended for Windows</Badge>
									</div>
									<div class="rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm">
										<code class="block"
											>powershell -ExecutionPolicy ByPass -c "irm
											https://www.codesfer.io/install.ps1 | iex"</code
										>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="homebrew">
							<div class="mb-2">
								<Badge variant="secondary">Recommended for macOS</Badge>
							</div>
							<div class="rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm">
								<code class="block">brew tap gnitoahc/tap</code>
								<code class="block">brew install gnitoahc/tap/codesfer</code>
							</div>
						</TabsContent>

						<TabsContent value="releases">
							<p class="mb-3 text-sm text-muted-foreground">
								Download the pre-built binary for your platform from GitHub Releases.
							</p>
							<a
								href="https://github.com/GNITOAHC/codesfer/releases"
								class="inline-flex items-center gap-2 text-primary underline hover:no-underline"
							>
								<Download class="h-4 w-4" />
								View Releases on GitHub
							</a>
						</TabsContent>

						<TabsContent value="source">
							<p class="mb-3 text-sm text-muted-foreground">
								Requires Go 1.24+ installed on your system.
							</p>
							<div class="rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm">
								<code class="block">git clone https://github.com/GNITOAHC/codesfer.git</code>
								<code class="block">cd codesfer</code>
								<code class="block">make all</code>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</section>

		<!-- Authentication Section -->
		<section class="mb-20">
			<div class="mb-8">
				<h2 class="mb-3 flex items-center gap-3 text-3xl font-bold">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Shield class="h-5 w-5 text-primary" />
					</div>
					Authentication
				</h2>
				<p class="text-muted-foreground">Manage your account and authentication on the server.</p>
			</div>

			<div class="grid gap-6 md:grid-cols-3">
				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<UserPlus class="h-5 w-5 text-primary" />
							Register
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="mb-4 text-sm text-muted-foreground">Create a new account on the server.</p>
						<code class="block rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm"
							>codesfer auth register</code
						>
					</CardContent>
				</Card>

				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<LogIn class="h-5 w-5 text-primary" />
							Login
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="mb-4 text-sm text-muted-foreground">Log in to your account.</p>
						<code class="block rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm"
							>codesfer auth login</code
						>
					</CardContent>
				</Card>

				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<LogOut class="h-5 w-5 text-primary" />
							Logout
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="mb-4 text-sm text-muted-foreground">Log out from your current session.</p>
						<code class="block rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm"
							>codesfer auth logout</code
						>
					</CardContent>
				</Card>
			</div>
		</section>

		<!-- CLI Usage Section -->
		<section class="mb-20">
			<div class="mb-8">
				<h2 class="mb-3 flex items-center gap-3 text-3xl font-bold">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<TerminalIcon class="h-5 w-5 text-primary" />
					</div>
					CLI Usage
				</h2>
				<p class="text-muted-foreground">Essential commands to manage your code snippets.</p>
			</div>

			<div class="space-y-6">
				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<Upload class="h-5 w-5 text-primary" />
							Push (Upload)
						</CardTitle>
						<CardDescription>
							Compresses files into a zip, encrypts if requested, and uploads to your server.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="mb-6 overflow-x-auto rounded-lg border bg-muted/50 p-4">
							<code class="font-mono text-sm">
								codesfer push &lt;file&gt; [-k alias] [-d desc] [--pass password]
							</code>
						</div>
						<div class="space-y-3 text-sm">
							<div class="flex items-start gap-3">
								<Badge variant="outline" class="font-mono">-k, --key</Badge>
								<span class="text-muted-foreground">Custom alias for the snippet</span>
							</div>
							<div class="flex items-start gap-3">
								<Badge variant="outline" class="font-mono">-d, --desc</Badge>
								<span class="text-muted-foreground">Description for the upload</span>
							</div>
							<div class="flex items-start gap-3">
								<Badge variant="outline" class="font-mono">--pass</Badge>
								<span class="text-muted-foreground">Password for encryption</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<FolderDown class="h-5 w-5 text-primary" />
							Pull (Download)
						</CardTitle>
						<CardDescription>
							Downloads the archive and automatically decompresses it to your specified directory.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="mb-6 overflow-x-auto rounded-lg border bg-muted/50 p-4">
							<code class="font-mono text-sm">codesfer pull &lt;code|alias&gt; [-o out_dir]</code>
						</div>
						<div class="text-sm">
							<div class="flex items-start gap-3">
								<Badge variant="outline" class="font-mono">-o, --out</Badge>
								<span class="text-muted-foreground"
									>Output directory (default: current directory)</span
								>
							</div>
						</div>
					</CardContent>
				</Card>

				<div class="grid gap-6 md:grid-cols-2">
					<Card class="border-2 transition-shadow hover:shadow-lg">
						<CardHeader>
							<CardTitle class="flex items-center gap-2">
								<List class="h-5 w-5 text-primary" />
								List
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p class="mb-4 text-sm text-muted-foreground">List all your uploaded snippets.</p>
							<code class="block rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm"
								>codesfer list</code
							>
						</CardContent>
					</Card>

					<Card class="border-2 transition-shadow hover:shadow-lg">
						<CardHeader>
							<CardTitle class="flex items-center gap-2">
								<Trash2 class="h-5 w-5 text-primary" />
								Remove
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p class="mb-4 text-sm text-muted-foreground">Remove a snippet from the server.</p>
							<code class="block rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm"
								>codesfer remove &lt;code|alias&gt;</code
							>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	</div>
</div>
