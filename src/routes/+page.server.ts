import type { ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load: ServerLoad = async () => {
	const sets = await client.flashcardSet.findMany({
		include: {
			author: true,
			flashcards: true
		}
	});

	return { sets: sets.reverse() };
};
