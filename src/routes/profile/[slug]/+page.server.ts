import type { ServerLoad } from '@sveltejs/kit';
import { fetch_user } from '$lib/api/server';
import { minimize_set_display } from '$lib/utils';

export const load: ServerLoad = async ({ parent, params }) => {
	const { lucia } = await parent();

	const slugUser = (await fetch_user(params.slug || '')).user;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	slugUser.flashcard_sets = minimize_set_display(slugUser.flashcard_sets);

	if (lucia) {
		return { user: lucia.user, slugUser };
	}

	return { url: process.env.DISCORD_LOGIN_URL, slugUser };
};
