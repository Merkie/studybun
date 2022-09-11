import type { ISet } from './types';

export const minimize_set_display = (sets: ISet[]) => {
	return sets.map((set) => {
		return {
			id: set.id,
			name: set.name,
			views: set.views,
			term_count: set.flashcards.length,
			author_name: set.author.name,
			author_id: set.author.id,
			author_image: set.author.image,
			created_at: set.createdAt
		};
	});
};
