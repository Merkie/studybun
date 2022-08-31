import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	if (lucia) {
		return { user: lucia.user };
	}

	return { url: process.env.DISCORD_LOGIN_URL };
};
