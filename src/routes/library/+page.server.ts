import type { ServerLoad } from '@sveltejs/kit';
import { fetch_user_sets } from '$lib/api/server';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	const { sets } = await fetch_user_sets(lucia.id);

	if (lucia) return { user: lucia.user, sets: sets.reverse() };

	return { sets: null, user: null };
};
