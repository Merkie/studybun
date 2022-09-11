import type { ServerLoad } from '@sveltejs/kit';
import { fetch_all_sets, fetch_sets_from_list, fetch_trending_sets } from '$lib/api/server';
import { client } from '$lib/prisma';
import { minimize_set_display } from '$lib/utils';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	let recent_sets_objects;
	let saved_sets: string[] = [];

	if (lucia && lucia.user) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			}
		});

		// saved_sets = user?.saved_flashcard_sets || [];

		// 	if (user) {
		// 		let recents = user.recently_viewed;
		// 		recents = [...new Set(recents)];
		// 		recents = recents.slice(0, 5);
		// 		recent_sets_objects = (await fetch_sets_from_list(recents)).sets;
		// 	}
		// }

		const { sets } = await fetch_all_sets();
		const trending = (await fetch_trending_sets()).sets;

		return {
			sets: minimize_set_display(sets).reverse(),
			trendingSets: minimize_set_display(trending),
			recentlyViewed: recent_sets_objects,
			savedSets: saved_sets
		};
	}
};
