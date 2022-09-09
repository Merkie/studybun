// Types
import type { DuckDuckGoImage } from 'duckduckgo-images-api';
import type { Session } from 'lucia-sveltekit/types';
import type { ISet, IUser } from '../types';

// Post function that is used internally within this file
const _post = async (url: string, body: any) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	return JSON.parse(await (await response.blob()).text());
};

// Defines a flashcard given a term and context
export const define_from_term = async (
	term: string,
	context: string,
	session: Session
): Promise<{ description: string; error: string }> => {
	if (!session || !session.user) {
		return { description: '', error: 'User not logged in.' };
	}
	return await _post('/api/ai/define', {
		term,
		context,
		session
	});
};

// Checks free response answer given the term and response
export const check_free_response = async (
	term: string,
	response: string,
	session: Session
): Promise<{ feedback: boolean; error: string }> => {
	if (!session || !session.user) {
		return { feedback: false, error: 'User not logged in.' };
	}
	return await _post('/api/ai/freeresponse', { term, response, session });
};

// Gets a list of terms given a context
export const fetch_term_suggestions = async (
	context: string,
	session: Session
): Promise<{ terms: string[]; error: string }> => {
	if (!session || !session.user) {
		return { terms: [], error: 'User not logged in.' };
	}
	return await _post('/api/ai/list', { context, session });
};

// Get more terms given a context and terms
export const fetch_more_term_suggestions = async (
	context: string,
	terms: string[],
	session: Session
): Promise<{ terms: string[]; error: string }> => {
	if (!session || !session.user) {
		return { terms: [], error: 'User not logged in.' };
	}
	return await _post('/api/ai/list/continue', { context, terms, session });
};

// Get a list of images given a term
export const fetch_images = async (term: string): Promise<{ images: DuckDuckGoImage[] }> => {
	return await _post('/api/images', { term });
};

// Delete a set
export const delete_set = async (id: string, session: Session): Promise<{ success: boolean }> => {
	return await _post('/api/set/delete', { id, session });
};

// Fetch a set
// export const fetch_set = async (id: string): Promise<{ set: ISet }> => {
// 	return await _post('/api/set/fetch', { id });
// };

// Search sets
export const search_sets = async (term: string): Promise<{ sets: ISet[] }> => {
	return await _post('/api/set/search', { term });
};

// Fetch all sets
// Limit 100
// export const fetch_all_sets = async (): Promise<{ sets: ISet[] }> => {
// 	return await _post('/api/set/all', {});
// };

// Publish a set
export const publish_set = async (
	setList: Array<object>,
	context: string,
	user: IUser,
	description: string,
	editingSet: string
) => {
	await _post('/api/user/publish', {
		set: setList,
		context: context,
		user: user,
		description,
		editingSet
	});
};

export const toggle_favorite = async (setId: string, session: Session) => {
	await _post('/api/set/favorite', {
		setId,
		session
	});
};

// // Fetch user sets
// export const fetch_user_sets = async (userId: string): Promise<{ sets: ISet[] }> => {
// 	return await _post('/api/user/sets', { userId });
// };
