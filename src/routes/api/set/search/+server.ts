import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';
import { minimize_set_display } from '$lib/utils';

export const POST: RequestHandler = async ({ request }) => {
	const { term } = await request.json();

	const result = await client.flashcardSet.findMany({
		where: {
			name: {
				search: term
			},
			description: {
				search: term
			}
		},
		include: {
			author: true,
			flashcards: true
		}
	});

	if (!result) return new Response(JSON.stringify({ sets: [] }), { status: 200 });

	return new Response(JSON.stringify({ sets: minimize_set_display(result) }), { status: 200 });
};
