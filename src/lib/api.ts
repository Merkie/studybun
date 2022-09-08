// Types
import type { DuckDuckGoImage } from 'duckduckgo-images-api';
import type { ISet, IUser } from './types';

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
	userId: string
): Promise<{ description: string }> => {
	return await _post('/api/ai/define', {
		term,
		context,
		userId
	});
};

// Checks free response answer given the term and response
// TODO: Add userId and context
export const check_free_response = async (
	term: string,
	response: string
): Promise<{ feedback: boolean }> => {
	return await _post('/api/ai/freeresponse', { term, response });
};

// Gets a list of terms given a context
// TODO: Add userId
export const fetch_term_suggestions = async (context: string): Promise<{ terms: string[] }> => {
	return await _post('/api/ai/list', { context });
};

// Get more terms given a context and terms
// TODO: Add userId
export const fetch_more_term_suggestions = async (
	context: string,
	terms: string[]
): Promise<{ terms: string[] }> => {
	return await _post('/api/ai/list/continue', { context, terms });
};

// Get a list of images given a term
export const fetch_images = async (term: string): Promise<{ images: DuckDuckGoImage[] }> => {
	return await _post('/api/images', { term });
};

// Delete a set
// TODO: Add userId and authentication
export const delete_set = async (id: string): Promise<{ success: boolean }> => {
	return await _post('/api/set/delete', { id });
};

// Fetch a set
export const fetch_set = async (id: string): Promise<{ set: ISet }> => {
	return await _post('/api/set/fetch', { id });
};

// Search sets
export const search_sets = async (term: string): Promise<{ sets: ISet[] }> => {
	return await _post('/api/set/search', { term });
};

// Fetch all sets
// Limit 100
export const fetch_all_sets = async (): Promise<{ sets: ISet[] }> => {
	return await _post('/api/set/all', {});
};

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

// Fetch user sets
export const fetch_user_sets = async (userId: string): Promise<{ sets: ISet[] }> => {
	return await _post('/api/user/sets', { userId });
};
