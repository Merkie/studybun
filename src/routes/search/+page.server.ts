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

		return { user: lucia.user, saved: user?.saved_flashcard_sets || [] };
	}

	return {};
};
