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
				flashcards: true,
				author: true
			}
		});

		const newSets = sets.map((set) => {
			return {
				...set,
				flashcards: set.flashcards.map((flashcard) => {
					return {
						body: 'hidden'
					};
				})
			};
		});

		return { user: lucia.user, sets: newSets.reverse() };
	}

	return { url: process.env.DISCORD_LOGIN_URL };
};
