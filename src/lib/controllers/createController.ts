export const fetchTerms = async (context: string) => {
	if (!context) return;
	const response = await fetch('/api/ai/list', {
		method: 'POST',
		body: JSON.stringify({ context })
	});

	const resData = JSON.parse(await (await response.blob()).text());
	return resData.terms;
};

export const suggestMoreTerms = async (context: string, suggestions: string[]) => {
	if (!context) return;
	const response = await fetch('/api/ai/list', {
		method: 'POST',
		body: JSON.stringify({ context, suggestions })
	});

	// Grab json data from response
	const resData = JSON.parse(await (await response.blob()).text());

	if (!resData.terms) return; // If no terms, return

	// Add new terms to the list
	return [...suggestions, ...resData.terms];
};

export const publishSet = async (setList: Array<object>, context: string, data: object) => {
	await fetch('/api/user/publish', {
		method: 'POST',
		body: JSON.stringify({ set: setList, context: context, user: data.user.user_id })
	});
};
