import type { ServerLoad } from '@sveltejs/kit';
import { fetch_all_sets, fetch_sets_from_list, fetch_trending_sets } from '$lib/api/server';
import { client } from '$lib/prisma';
import { minimize_set_display } from '$lib/utils';
import type { ISet } from '$lib/types';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	let recently_viewed_sets: ISet[] = [];
	let saved_sets: string[] = [];

	const { sets } = await fetch_all_sets();
	const trending = (await fetch_trending_sets()).sets;

	if (lucia && lucia.user) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			},
			include: {
				saved_flashcard_sets: true,
				recently_viewed: true
			}
		});

		if (!user) return;

		saved_sets = user.saved_flashcard_sets?.map((item) => item.flashcardSetId);
		const recently_viewed_set_ids = Array.from(
			new Set(user.recently_viewed.map((item) => item.flashcardSetId))
		);

		recently_viewed_sets = (
			await fetch_sets_from_list(recently_viewed_set_ids.reverse().slice(0, 10))
		).sets;
	}

	return {
		sets: minimize_set_display(sets).reverse() || [],
		trendingSets: minimize_set_display(trending) || [],
		recentlyViewed: minimize_set_display(recently_viewed_sets) || [],
		savedSets: saved_sets || []
	};
};
