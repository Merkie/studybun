import type { ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent, params }) => {
	const { lucia } = await parent();

	const set = await client.flashcardSet.findFirst({
		where: {
			id: params.slug
		},
		include: {
			flashcards: true
		}
	});

	if (!set) return { url: '/404' };

	if (lucia) {
		return { user: lucia.user, set };
	}

	return { url: process.env.DISCORD_LOGIN_URL, set };
};
