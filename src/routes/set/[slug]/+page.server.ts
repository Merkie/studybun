import type { ServerLoad } from '@sveltejs/kit';
import { fetch_set } from '$lib/api/server';
import { client } from '$lib/prisma';

export const load: ServerLoad = async ({ parent, params }) => {
	const { lucia } = await parent();
	let isFavorited = false;
	let increase_view = false;

	if (lucia && lucia.user) {
		const user = await client.user.findFirst({
			where: {
				id: lucia.user.user_id
			},
			include: {
				recently_viewed: true
			}
		});

		console.log(user);

		const last_viewed = user?.recently_viewed[user.recently_viewed.length - 1];

		if (last_viewed?.flashcardSetId != params.slug) {
			increase_view = true;
			const recently_viewed_obj = await client.recentlyViewedSet.create({
				data: {
					user: {
						connect: {
							id: lucia.user.user_id
						}
					},
					set: {
						connect: {
							id: params.slug
						}
					}
				}
			});

			await client.user.update({
				where: {
					id: user?.id
				},
				data: {
					recently_viewed: {
						connect: {
							id: recently_viewed_obj.id
						}
					}
				}
			});

			await client.flashcardSet.update({
				where: {
					id: params.slug
				},
				data: {
					views: {
						increment: 1
					}
				}
			});
		}

		const saved_set = await client.savedSet.findFirst({
			where: {
				user: {
					id: lucia.user.user_id
				},
				set: {
					id: params.slug
				}
			}
		});

		if (saved_set) {
			isFavorited = true;
		}
	}

	const set = await fetch_set(params.slug || '', increase_view);
	return { ...set, isFavorited };
};
