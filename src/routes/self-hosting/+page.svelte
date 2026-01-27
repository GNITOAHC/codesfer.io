<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Terminal } from '$lib/components/terminal';
	import { Server, Database, Cloud, Key, CodeXml, Workflow } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Self-Hosting - Codesfer</title>
	<meta name="description" content="Learn how to self-host your own Codesfer server." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden border-b">
	<div class="absolute inset-0 -z-10 bg-linear-to-b from-primary/5 to-transparent"></div>
	<div class="container mx-auto px-4 py-16">
		<div class="mx-auto max-w-4xl text-center">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
			>
				<Server class="h-4 w-4" />
				Self-Hosting Guide
			</div>
			<h1 class="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
				Run Your Own Codesfer Server
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
				Deploy and manage your own Codesfer instance for complete control over your code snippets
				and data.
			</p>
		</div>
	</div>
</section>

<div class="container mx-auto px-4 py-12">
	<div class="mx-auto max-w-5xl">
		<!-- Server Setup Section -->
		<section class="mb-20">
			<div class="mb-8">
				<h2 class="mb-3 flex items-center gap-3 text-3xl font-bold">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Server class="h-5 w-5 text-primary" />
					</div>
					Server Setup
				</h2>
				<p class="text-muted-foreground">Get your Codesfer server up and running in seconds.</p>
			</div>

			<Card class="border-2 transition-shadow hover:shadow-lg">
				<CardHeader>
					<CardTitle>Running the Server</CardTitle>
					<CardDescription>Start your Codesfer server with a single command.</CardDescription>
				</CardHeader>
				<CardContent>
					<Terminal
						title="Server"
						lines={[
							{ type: 'command', text: 'codeserve serve --port 3000' },
							{ type: 'output', text: '> Server running on http://localhost:3000' }
						]}
						typeSpeed={25}
					/>
				</CardContent>
			</Card>
		</section>

		<!-- Environment Variables Section -->
		<section class="mb-20">
			<div class="mb-8">
				<h2 class="mb-3 flex items-center gap-3 text-3xl font-bold">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Key class="h-5 w-5 text-primary" />
					</div>
					Environment Variables
				</h2>
				<p class="text-muted-foreground">
					Configure your server with environment variables for flexible deployment.
				</p>
			</div>

			<div class="space-y-6">
				<!-- Database Configuration -->
				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<Database class="h-5 w-5 text-primary" />
							Database Configuration
						</CardTitle>
						<CardDescription>
							Configure authentication and file index databases. Supports sqlite and libsql drivers.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="mb-6 rounded-lg border-l-4 border-primary bg-primary/5 p-4 text-sm">
							<p class="font-medium text-foreground">How it works</p>
							<p class="mt-2 text-muted-foreground">
								Database configuration uses driver/source pairs. The
								<code class="rounded bg-background px-1.5 py-0.5 font-mono text-xs">*_DRIVER</code>
								specifies the database type (<code class="font-mono text-xs">sqlite</code> or
								<code class="font-mono text-xs">libsql</code>), and
								<code class="rounded bg-background px-1.5 py-0.5 font-mono text-xs">*_SOURCE</code>
								provides the connection string. Run
								<code class="rounded bg-background px-1.5 py-0.5 font-mono text-xs"
									>codeserver init</code
								> to generate default setups.
							</p>
						</div>
						<div class="overflow-x-auto rounded-lg border">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b bg-muted/50">
										<th class="px-4 py-3 text-left font-semibold">Variable</th>
										<th class="px-4 py-3 text-left font-semibold">Description</th>
										<th class="px-4 py-3 text-left font-semibold">Default</th>
									</tr>
								</thead>
								<tbody class="divide-y">
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>DB_DRIVER</code
											>
										</td>
										<td class="px-4 py-4">
											<div class="flex items-center gap-2 text-muted-foreground">
												<span>Auth database driver</span>
												<div class="flex gap-1.5">
													<Badge variant="outline" class="font-mono text-xs">sqlite</Badge>
													<Badge variant="outline" class="font-mono text-xs">libsql</Badge>
												</div>
											</div>
										</td>
										<td class="px-4 py-4 text-muted-foreground">
											<code class="font-mono text-xs">sqlite</code>
										</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>DB_SOURCE</code
											>
										</td>
										<td class="px-4 py-4 text-muted-foreground">Auth database connection string</td>
										<td class="px-4 py-4 text-muted-foreground">
											<code class="font-mono text-xs">file:auth.db</code>
										</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>INDEX_DB_DRIVER</code
											>
										</td>
										<td class="px-4 py-4">
											<div class="flex items-center gap-2 text-muted-foreground">
												<span>File index database driver</span>
												<div class="flex gap-1.5">
													<Badge variant="outline" class="font-mono text-xs">sqlite</Badge>
													<Badge variant="outline" class="font-mono text-xs">libsql</Badge>
												</div>
											</div>
										</td>
										<td class="px-4 py-4 text-muted-foreground">
											<code class="font-mono text-xs">sqlite</code>
										</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>INDEX_DB_SOURCE</code
											>
										</td>
										<td class="px-4 py-4 text-muted-foreground"
											>File index database connection string</td
										>
										<td class="px-4 py-4 text-muted-foreground">
											<code class="font-mono text-xs">file:index.db</code>
										</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>OBJECT_STORAGE_DRIVER</code
											>
										</td>
										<td class="px-4 py-4">
											<div class="flex items-center gap-2 text-muted-foreground">
												<span>Object storage driver</span>
												<div class="flex gap-1.5">
													<Badge variant="outline" class="font-mono text-xs">sqlite</Badge>
													<Badge variant="outline" class="font-mono text-xs">r2</Badge>
												</div>
											</div>
										</td>
										<td class="px-4 py-4 text-muted-foreground">
											<code class="font-mono text-xs">sqlite</code>
										</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>OBJECT_STORAGE_SOURCE</code
											>
										</td>
										<td class="px-4 py-4 text-muted-foreground">
											Object storage connection string (when OBJECT_STORAGE_DRIVER=sqlite)
										</td>
										<td class="px-4 py-4 text-muted-foreground">
											<code class="font-mono text-xs">file:object_storage.db</code>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				<!-- Cloudflare R2 Configuration -->
				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<Cloud class="h-5 w-5 text-primary" />
							Cloudflare R2 Configuration
						</CardTitle>
						<CardDescription>
							Required when using <code
								class="rounded bg-background px-1.5 py-0.5 font-mono text-xs"
								>OBJECT_STORAGE_DRIVER=r2</code
							>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="overflow-x-auto rounded-lg border">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b bg-muted/50">
										<th class="px-4 py-3 text-left font-semibold">Variable</th>
										<th class="px-4 py-3 text-left font-semibold">Description</th>
									</tr>
								</thead>
								<tbody class="divide-y">
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>CF_ACCOUNT_ID</code
											>
										</td>
										<td class="px-4 py-4 text-muted-foreground">Your Cloudflare Account ID</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>CF_ACCESS_KEY</code
											>
										</td>
										<td class="px-4 py-4 text-muted-foreground">R2 Access Key ID</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>CF_SECRET_ACCESS_KEY</code
											>
										</td>
										<td class="px-4 py-4 text-muted-foreground">R2 Secret Access Key</td>
									</tr>
									<tr class="transition-colors hover:bg-muted/30">
										<td class="px-4 py-4">
											<code class="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold"
												>CF_BUCKET</code
											>
										</td>
										<td class="px-4 py-4 text-muted-foreground">R2 Bucket Name</td>
									</tr>
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>

		<!-- Example Configurations Section -->
		<section class="mb-20">
			<div class="mb-8">
				<h2 class="mb-3 flex items-center gap-3 text-3xl font-bold">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Workflow class="h-5 w-5 text-primary" />
					</div>
					Example Configurations
				</h2>
				<p class="text-muted-foreground">
					Ready-to-use configuration examples for different deployment scenarios.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<div class="flex items-start justify-between">
							<div>
								<CardTitle class="flex items-center gap-2">
									<Database class="h-5 w-5 text-primary" />
									SQLite (Local)
								</CardTitle>
								<CardDescription class="mt-2"
									>Simple setup for personal use or development.</CardDescription
								>
							</div>
							<Badge variant="secondary">Quickstart</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div class="overflow-x-auto rounded-lg border bg-muted/50 p-4">
							<pre class="font-mono text-xs leading-relaxed"><code
									>export DB_DRIVER="sqlite"
export DB_SOURCE="file:auth.db"
export INDEX_DB_DRIVER="sqlite"
export INDEX_DB_SOURCE="file:index.db"
export OBJECT_STORAGE_DRIVER="sqlite"
export OBJECT_STORAGE_SOURCE="file:object_storage.db"

./build/codeserver -port 3000</code
								></pre>
						</div>
					</CardContent>
				</Card>

				<Card class="border-2 transition-shadow hover:shadow-lg">
					<CardHeader>
						<div class="flex items-start justify-between">
							<div>
								<CardTitle class="flex items-center gap-2">
									<Cloud class="h-5 w-5 text-primary" />
									Cloudflare R2
								</CardTitle>
								<CardDescription class="mt-2"
									>Production setup with scalable cloud storage.</CardDescription
								>
							</div>
							<Badge>Production</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div class="overflow-x-auto rounded-lg border bg-muted/50 p-4">
							<pre class="font-mono text-xs leading-relaxed"><code
									>export DB_DRIVER="sqlite"
export DB_SOURCE="file:auth.db"
export INDEX_DB_DRIVER="sqlite"
export INDEX_DB_SOURCE="file:index.db"
export OBJECT_STORAGE_DRIVER="r2"
export CF_ACCOUNT_ID="your-account-id"
export CF_ACCESS_KEY="your-access-key"
export CF_SECRET_ACCESS_KEY="your-secret-key"
export CF_BUCKET="your-bucket-name"

./build/codeserver -port 3000</code
								></pre>
						</div>
					</CardContent>
				</Card>

				<Card class="border-2 transition-shadow hover:shadow-lg md:col-span-2">
					<CardHeader>
						<div class="flex items-start justify-between">
							<div>
								<CardTitle class="flex items-center gap-2">
									<CodeXml class="h-5 w-5 text-primary" />
									Turso/LibSQL (Distributed)
								</CardTitle>
								<CardDescription class="mt-2"
									>Distributed database with Turso and R2 object storage.</CardDescription
								>
							</div>
							<Badge variant="outline">Advanced</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div class="overflow-x-auto rounded-lg border bg-muted/50 p-4">
							<pre class="font-mono text-xs leading-relaxed"><code
									>export DB_DRIVER="libsql"
export DB_SOURCE="libsql://your-database.turso.io?authToken=your-auth-token"
export INDEX_DB_DRIVER="libsql"
export INDEX_DB_SOURCE="libsql://your-index-db.turso.io?authToken=your-auth-token"
export OBJECT_STORAGE_DRIVER="r2"
export CF_ACCOUNT_ID="your-account-id"
export CF_ACCESS_KEY="your-access-key"
export CF_SECRET_ACCESS_KEY="your-secret-key"
export CF_BUCKET="your-bucket-name"

./build/codeserver -port 3000</code
								></pre>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>

		<!-- REST API Section -->
		<section>
			<div class="mb-8">
				<h2 class="mb-3 flex items-center gap-3 text-3xl font-bold">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<CodeXml class="h-5 w-5 text-primary" />
					</div>
					REST API Endpoints
				</h2>
				<p class="text-muted-foreground">Build custom integrations using the exposed REST API.</p>
			</div>

			<Card class="border-2 transition-shadow hover:shadow-lg">
				<CardHeader>
					<CardTitle>Available Endpoints</CardTitle>
					<CardDescription>
						The server exposes these endpoints for authentication and storage management.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="overflow-x-auto rounded-lg border">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b bg-muted/50">
									<th class="px-4 py-3 text-left font-semibold">Method</th>
									<th class="px-4 py-3 text-left font-semibold">Endpoint</th>
									<th class="px-4 py-3 text-left font-semibold">Description</th>
								</tr>
							</thead>
							<tbody class="divide-y">
								<tr class="transition-colors hover:bg-muted/30">
									<td class="px-4 py-4">
										<Badge>POST</Badge>
									</td>
									<td class="px-4 py-4">
										<code class="rounded bg-muted px-2 py-1 font-mono text-xs">/auth/login</code>
									</td>
									<td class="px-4 py-4 text-muted-foreground">Authenticate user</td>
								</tr>
								<tr class="transition-colors hover:bg-muted/30">
									<td class="px-4 py-4">
										<Badge variant="secondary">GET</Badge>
									</td>
									<td class="px-4 py-4">
										<code class="rounded bg-muted px-2 py-1 font-mono text-xs">/storage/list</code>
									</td>
									<td class="px-4 py-4 text-muted-foreground">List user's snippets</td>
								</tr>
								<tr class="transition-colors hover:bg-muted/30">
									<td class="px-4 py-4">
										<Badge>POST</Badge>
									</td>
									<td class="px-4 py-4">
										<code class="rounded bg-muted px-2 py-1 font-mono text-xs">/storage/upload</code
										>
									</td>
									<td class="px-4 py-4 text-muted-foreground">Upload a new snippet</td>
								</tr>
								<tr class="transition-colors hover:bg-muted/30">
									<td class="px-4 py-4">
										<Badge variant="destructive">DELETE</Badge>
									</td>
									<td class="px-4 py-4">
										<code class="rounded bg-muted px-2 py-1 font-mono text-xs">/storage/remove</code
										>
									</td>
									<td class="px-4 py-4 text-muted-foreground">Remove a snippet</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</section>
	</div>
</div>
