import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';
import type { Session } from 'lucia-sveltekit/types';

export const POST: RequestHandler = async ({ request }) => {
	const { id, session } = await request.json();
	const sess = session as Session;

	const setObj = await client.flashcardSet.findFirst({
		where: {
			id
		}
	});

	if (!setObj) return new Response(JSON.stringify({ success: false }), { status: 500 });

	if (setObj?.userId == sess?.user.user_id) {
		await client.flashcardSet.delete({
			where: {
				id
			},
			include: {
				flashcards: true,
				comments: true,
				likes: true,
				RecentlyViewedSet: true,
				SavedSet: true
			}
		});

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	}

	return new Response(JSON.stringify({ success: false }), { status: 200 });
};
