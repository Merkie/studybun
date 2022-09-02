import type { ServerLoad } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent, params }) => {
	const { lucia } = await parent();

	const slugUser = await client.user.findFirst({
		where: {
			id: params.slug
		}
	});

	if (!slugUser) return { url: '/404' };

	if (lucia) {
		return { user: lucia.user, slugUser };
	}

	return { url: process.env.DISCORD_LOGIN_URL, slugUser };
};
