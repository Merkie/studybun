import type { ServerLoad } from '@sveltejs/kit';
import { fetch_all_sets, fetch_sets_from_list, fetch_trending_sets } from '$lib/api/server';
import { client } from '$lib/prisma';
import type { ISet } from '$lib/types';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	let recent_sets_objects;

	if (lucia && lucia.user) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			}
		});

		if (user) {
			let recents = user.recently_viewed;
			recents = [...new Set(recents)];
			recents = recents.slice(0, 5);
			recent_sets_objects = (await fetch_sets_from_list(recents)).sets;
		}
	}

	const { sets } = await fetch_all_sets();
	const trending = (await fetch_trending_sets()).sets;

	return {
		sets: sets.reverse(),
		trendingSets: trending,
		recentlyViewed: recent_sets_objects
	};
};
