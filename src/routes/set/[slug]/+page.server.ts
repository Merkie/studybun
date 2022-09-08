import type { ServerLoad } from '@sveltejs/kit';
import { fetch_set } from '$lib/api/server';

export const load: ServerLoad = async ({ params }) => {
	const set = await fetch_set(params.slug || '');
	return set;
};
