import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	const setObj = await client.flashcardSet.delete({
		where: {
			id
		},
		include: {
			flashcards: true
		}
	});

	if (!setObj) return new Response(JSON.stringify({ success: false }), { status: 500 });

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
