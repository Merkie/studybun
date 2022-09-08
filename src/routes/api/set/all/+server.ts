import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const result = await client.flashcardSet.findMany({
		include: {
			author: true,
			flashcards: true
		}
	});

	const newSets = result.map((set) => {
		return {
			...set,
			flashcards: set.flashcards.map(() => {
				return {
					body: 'hidden'
				};
			})
		};
	});

	if (!result) return new Response(JSON.stringify({ sets: [] }), { status: 200 });

	return new Response(JSON.stringify({ sets: newSets.splice(100) }), { status: 200 });
};
