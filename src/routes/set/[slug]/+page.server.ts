import type { ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ params }) => {
	const set = await client.flashcardSet.findFirst({
		where: {
			id: params.slug
		},
		include: {
			flashcards: true,
			author: true
		}
	});

	return { set };
};
