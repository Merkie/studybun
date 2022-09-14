import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { setId, session, create } = await request.json();

	const user = await client.user.findFirst({
		where: {
			id: session.user.user_id
		},
		include: {
			saved_flashcard_sets: true
		}
	});

	if (create) {
		const old_favorite = await client.savedSet.findFirst({
			where: {
				userId: session.user.user_id,
				flashcardSetId: setId
			}
		});

		if (old_favorite) {
			return new Response(JSON.stringify({ success: true }), { status: 200 });
		}

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
	} else {
		await client.savedSet.deleteMany({
			where: {
				userId: session.user.user_id,
				flashcardSetId: setId + ''
			}
		});
	}

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
