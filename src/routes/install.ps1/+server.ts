import type { RequestHandler } from './$types';
import { serveInstallScript } from '$lib/server/install-scripts';

export const prerender = false;

export const GET: RequestHandler = () => serveInstallScript('install.ps1');
