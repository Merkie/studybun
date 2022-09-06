import type { ServerLoad } from '@sveltejs/kit';
// import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();

	if (lucia) {
		return { user: lucia.user };
	}

	return { url: process.env.DISCORD_LOGIN_URL };
};
