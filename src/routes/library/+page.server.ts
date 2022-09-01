import type { ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();

	if (lucia) {
		const sets = await client.flashcardSet.findMany({
			where: {
				userId: lucia.user.user_id
			},
			include: {
				flashcards: true
			}
		});

		console.log(sets);
		return { user: lucia.user, sets: sets };
	}

	return { url: process.env.DISCORD_LOGIN_URL };
};