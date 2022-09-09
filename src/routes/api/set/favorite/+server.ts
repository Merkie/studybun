import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { setId, session } = await request.json();

	const user = await client.user.findFirst({
		where: {
			id: session.user.user_id
		}
	});

	if (user?.saved_flashcard_sets.includes(setId)) {
		const newSavedSets: string[] = user.saved_flashcard_sets.filter((set) => set !== setId);
		await client.user.update({
			where: {
				id: session.user.user_id
			},
			data: {
				saved_flashcard_sets: newSavedSets
			}
		});
	} else {
		await client.user.update({
			where: {
				id: session.user.user_id
			},
			data: {
				saved_flashcard_sets: {
					push: setId
				}
			}
		});
	}

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
