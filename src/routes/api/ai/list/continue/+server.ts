import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';

export const POST: RequestHandler = async ({ request }) => {
	const { terms, context } = await request.json();

	// Get the AI autocomplete
	const response = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: `List 10 more terms for the following subject, do not repeat or copy terms, original terms only:\nSubject: ${context}\nTerms: ${terms.join(
			', '
		)}\nMore terms:`,
		temperature: 0.7,
		max_tokens: 70,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	let continuedTerms: string[] = [];

	// If we get choices back, provide the first one
	if (response.data.choices) {
		continuedTerms = response.data.choices[0].text?.trim().split(',') || [];
	}

	const termsEdited = continuedTerms.map((term: string) => {
		return term.trim();
	});

	// Send back the description
	return new Response(JSON.stringify({ terms: termsEdited }), { status: 200 });
};
