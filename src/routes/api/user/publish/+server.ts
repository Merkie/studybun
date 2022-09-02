import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { set, user, context } = await request.json();

	const userObj = await client.user.findFirst({
		where: {
			id: user.user_ud
		}
	});

	if (!userObj) return new Response(JSON.stringify({ error: 'User not found' }), { status: 500 });

	const setObj = await client.flashcardSet.create({
		data: {
			author: {
				connect: {
					id: userObj.id
				}
			},
			name: context,
			description: '',
			flashcards: {
				create: set.map(({ term, definition }) => ({ term, description: definition }))
			}
		}
	});

	return new Response('ok', { status: 200 });
};
