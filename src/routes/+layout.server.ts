import { auth } from '$lib/lucia';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { client } from '$lib/prisma';

export const load = async (event: ServerLoadEvent) => {
	const response = await auth.load(event);
	console.log(response);
	const url = process.env.DISCORD_LOGIN_URL;

	if (response.lucia) {
		const user = await client.user.findFirst({
			where: { id: response.lucia.user.user_id }
		});

		if (user) return { ...response, user, url };
	}

	return { response, url };
};
