import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { user } = await request.json();

	const userObj = await client.user.findFirst({
		where: {
			id: user
		}
	});

	if (!userObj) return new Response(JSON.stringify({ error: 'User not found' }), { status: 500 });

	const sets = await client.flashcardSet.findMany({
		where: {
			userId: user
		}
	});

	return new Response(JSON.stringify({ sets }), { status: 200 });
};
