import type { ServerLoad } from '@sveltejs/kit';
import { fetch_user_sets } from '$lib/api/server';
import { minimize_set_display } from '$lib/utils';

export const load: ServerLoad = async ({ parent }) => {
	const { lucia } = await parent();
	const { sets } = await fetch_user_sets(lucia.user.user_id);

	if (lucia) return { user: lucia.user, sets: minimize_set_display(sets) };

	return { sets: null, user: null };
};
