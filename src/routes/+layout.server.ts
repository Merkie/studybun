import { auth } from '$lib/lucia';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load = async (event: ServerLoadEvent) => {
	const response = await auth.load(event);

	if (response.lucia) {
		const user = await client.user.findFirst({
			where: { id: response.lucia.user.user_id }
		});

		if (user) return { ...response, user };
	}

	return response;
};
