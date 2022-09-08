import type { ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load: ServerLoad = async () => {
	const sets = await client.flashcardSet.findMany({
		include: {
			author: true,
			flashcards: true
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

	return { sets: newSets.reverse() };
};
