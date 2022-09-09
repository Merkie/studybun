import type { ServerLoad } from '@sveltejs/kit';
import { fetch_set } from '$lib/api/server';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent, params }) => {
	const { lucia } = await parent();
	let isFavorited = false;

	if (lucia && lucia.user) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			}
		});

		user?.recently_viewed.unshift(params.slug + '');
		isFavorited = user?.saved_flashcard_sets.includes(params.slug + '') || false;

		await client.user.update({
			where: {
				id: user?.id
			},
			data: {
				recently_viewed: user?.recently_viewed
			}
		});
	}

	const set = await fetch_set(params.slug || '');
	return { ...set, isFavorited };
};
