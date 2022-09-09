import type { ServerLoad } from '@sveltejs/kit';
import { fetch_sets_from_list } from '$lib/api/server';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	let sets: ISet[] = [];

	if (lucia.user) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			}
		});

		sets = (await fetch_sets_from_list(user?.saved_flashcard_sets || [])).sets;
	}

	if (lucia) return { user: lucia.user, sets: sets.reverse() };

	return { sets: null, user: null };
};
