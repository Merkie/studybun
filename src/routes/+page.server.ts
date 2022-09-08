import type { ServerLoad } from '@sveltejs/kit';
import { fetch_all_sets } from '$lib/api_server';

export const load: ServerLoad = async () => {
	const { sets } = await fetch_all_sets();
	return { sets: sets.reverse() };
};
