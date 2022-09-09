import type { ServerLoad } from '@sveltejs/kit';
import { fetch_all_sets, fetch_trending_sets } from '$lib/api/server';

export const load: ServerLoad = async () => {
	const { sets } = await fetch_all_sets();
	const trending = (await fetch_trending_sets()).sets;
	return { sets: sets.reverse(), trendingSets: trending };
};
