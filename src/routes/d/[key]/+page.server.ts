import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { API_BASE, type ObjectInfo } from '$lib/api';

export const prerender = false;

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const password = url.searchParams.get('password') ?? '';
	const qs = new URLSearchParams({ key: params.key });
	if (password) qs.set('password', password);

	const res = await fetch(`${API_BASE}/storage/info?${qs}`);

	// Protected object and no (or wrong) password: show the prompt.
	if (res.status === 401) {
		return {
			key: params.key,
			info: null,
			password: '',
			wrongPassword: password !== ''
		};
	}
	if (res.status === 404) error(404, 'file not found');
	if (!res.ok) error(res.status, (await res.text()) || 'failed to load file info');

	return {
		key: params.key,
		info: (await res.json()) as ObjectInfo,
		password,
		wrongPassword: false
	};
};
