/* eslint-disable @typescript-eslint/ban-ts-comment */
import { client } from '$lib/prisma';
import type { ISet, IUser } from './types';

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
			FlashcardSet: {
				include: {
					flashcards: true,
					author: true
				}
			}
		}
	});

	//@ts-ignore
	if (!slugUser) return { user: null };

	if (slugUser.FlashcardSet) {
		//@ts-ignore
		slugUser.FlashcardSet = slugUser?.FlashcardSet.map((set) => {
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
