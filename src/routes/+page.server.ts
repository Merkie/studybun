import type { ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();

	const sets = await client.flashcardSet.findMany({
		include: {
			flashcards: true,
			author: true
		}
	});

	if (lucia) {
		return { user: lucia.user, sets: sets };
	}

	return { url: process.env.DISCORD_LOGIN_URL, sets: sets };
};
