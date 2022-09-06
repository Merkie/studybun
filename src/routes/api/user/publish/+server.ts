import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';
import type { ISet } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	const { set, user, context, description, editingSet } = await request.json();

	const userObj = await client.user.findFirst({
		where: {
			id: user.user_id
		}
	});

	if (editingSet) {
		await client.flashcardSet.delete({
			where: {
				id: editingSet
			},
			include: {
				flashcards: true
			}
		});
	}

	if (!userObj) return new Response(JSON.stringify({ error: 'User not found' }), { status: 500 });

	const data: ISet = {
		author: {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			connect: {
				id: user.user_id
			}
		},
		name: context,
		description: description || '',
		flashcards: {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			create: set.map(({ term, description, image }) => ({
				term: term || '',
				description: description || '',
				image: image || ''
			}))
		}
	};

	if (editingSet != '') data.id = editingSet;

	await client.flashcardSet.create({
		data
	});

	return new Response('ok', { status: 200 });
};
