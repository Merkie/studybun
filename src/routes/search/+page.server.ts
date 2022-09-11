import { client } from '$lib/prisma';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, params }) => {
	const { lucia } = await parent();

	if (lucia) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			}
		});

		const saved_set_objects = await client.savedSet.findMany({
			where: {
				userId: lucia.user.user_id
			}
		});

		const set_ids = saved_set_objects.map((item) => item.flashcardSetId);

		return { user: lucia.user, saved: set_ids || [] };
	}

	return {};
};
