import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { setId, session } = await request.json();

	const user = await client.user.findFirst({
		where: {
			id: session.user.user_id
		},
		include: {
			saved_flashcard_sets: true
		}
	});

	const saved_flashcard_set = await client.savedSet.create({
		data: {
			user: {
				connect: {
					id: session.user.user_id
				}
			},
			set: {
				connect: {
					id: setId
				}
			}
		}
	});

	await client.user.update({
		where: {
			id: user?.id
		},
		data: {
			saved_flashcard_sets: {
				connect: {
					id: saved_flashcard_set.id
				}
			}
		}
	});

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
