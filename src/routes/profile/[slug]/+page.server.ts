import type { ServerLoad } from '@sveltejs/kit';
import { fetch_user } from '$lib/api/server';

export const load: ServerLoad = async ({ parent, params }) => {
	const { lucia } = await parent();

	const slugUser = (await fetch_user(params.slug || '')).user;

	if (lucia) {
		return { user: lucia.user, slugUser };
	}

	return { url: process.env.DISCORD_LOGIN_URL, slugUser };
};
