import type { RequestHandler } from '@sveltejs/kit';
import { client } from '$lib/prisma';
import type { ISet } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	const { set, user, context, description, editingSet } = await request.json();

	console.log(editingSet);

	const userObj = await client.user.findFirst({
		where: {
			id: user.user_ud
		}
	});

	if (editingSet) {
		const deletedSet = await client.flashcardSet.delete({
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
			connect: {
				id: userObj.id
			}
		},
		name: context,
		description: '',
		flashcards: {
			create: set.map(({ term, description }) => ({ term, description: description }))
		}
	};

	if (editingSet) data.id = editingSet;

	const setObj = await client.flashcardSet.create({
		data
	});

	return new Response('ok', { status: 200 });
};
