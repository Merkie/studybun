import type { ServerLoad } from '@sveltejs/kit';
import { fetch_sets_from_list } from '$lib/api/server';
import { client } from '$lib/prisma';
import { minimize_set_display } from '$lib/utils';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	let sets: ISet[] = [];

	if (lucia.user) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			},
			include: {
				saved_flashcard_sets: true
			}
		});

		const saved_set_objects = await client.savedSet.findMany({
			where: {
				userId: lucia.user.user_id
			}
		});
		const saved_set_ids = saved_set_objects.map((item) => item.flashcardSetId).reverse();
		const sets = minimize_set_display((await fetch_sets_from_list(saved_set_ids)).sets);

		if (lucia) return { user: lucia.user, sets };

		return { sets: null, user: null };
	}
};
