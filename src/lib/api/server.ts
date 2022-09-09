/* eslint-disable @typescript-eslint/ban-ts-comment */
import { client } from '$lib/prisma';
import type { Session } from 'lucia-sveltekit/types';
import type { ISet, IUser } from '../types';

// Fetches all sets and hides flashcard bodies
export const fetch_all_sets = async (): Promise<{ sets: ISet[] }> => {
	const result = await client.flashcardSet.findMany({
		include: {
			author: true,
			flashcards: true
		}
	});

	// If there isnt any result then just return a blank array
	if (!result) return { sets: [] };

	// Map all the flashcards to hide the body, this will reduce front end load when fetching this data
	const newSets = result.map((set) => {
		return {
			...set,
			flashcards: set.flashcards.map(() => {
				return {
					body: 'hidden'
				};
			})
		};
	});

	// Only get first 100 sets
	newSets.splice(100);

	//@ts-ignore
	return { sets: newSets };
};

export const fetch_set = async (id: string): Promise<{ set: ISet }> => {
	const set = await client.flashcardSet.findFirst({
		where: {
			id
		},
		include: {
			flashcards: true,
			author: true
		}
	});

	// Update the set's views
	await client.flashcardSet.update({
		where: {
			id
		},
		data: {
			views: {
				increment: 1
			}
		}
	});

	//@ts-ignore
	if (!set) return { set: null };
	//@ts-ignore
	return { set };
};

export const fetch_user = async (id: string): Promise<{ user: IUser }> => {
	const slugUser = await client.user.findFirst({
		where: {
			id
		},
		include: {
			flashcard_sets: {
				include: {
					flashcards: true,
					author: true
				}
			}
		}
	});

	//@ts-ignore
	if (!slugUser) return { user: null };

	if (slugUser.flashcard_sets) {
		//@ts-ignore
		slugUser.flashcard_sets = slugUser?.flashcard_sets.map((set) => {
			return {
				...set,
				flashcards: set.flashcards.map(() => {
					return {
						body: 'hidden'
					};
				})
			};
		});
	}

	return { user: slugUser };
};

export const fetch_user_sets = async (id: string): Promise<{ sets: ISet[] }> => {
	const sets = await client.flashcardSet.findMany({
		where: {
			id
		},
		include: {
			flashcards: true,
			author: true
		}
	});

	//@ts-ignore
	if (!sets) return { sets: null };

	const newSets = sets.map((set) => {
		return {
			...set,
			flashcards: set.flashcards.map(() => {
				return {
					body: 'hidden'
				};
			})
		};
	});

	//@ts-ignore
	return { sets: newSets };
};

export const increment_user_tokens = async (session: Session, amount: number): Promise<void> => {
	if (!session || !session.user) return;
	const token = await client.refreshToken.findFirst({
		where: {
			refresh_token: session.refresh_token
		}
	});

	let userId = '';

	if (token) {
		userId = token.user_id;
	}

	if (userId == '') return;

	const update = await client.user.update({
		where: {
			id: userId
		},
		data: {
			used_openai_tokens: {
				increment: amount
			}
		}
	});

	console.log(amount);
};
