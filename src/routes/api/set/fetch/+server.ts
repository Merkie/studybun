import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	const setObj = await client.flashcardSet.findFirst({
		where: {
			id
		},
		include: {
			flashcards: true
		}
	});

	if (!setObj) return new Response(JSON.stringify({ error: 'Set not found' }), { status: 500 });

	return new Response(JSON.stringify({ set: setObj }), { status: 200 });
};
