import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';

export const POST: RequestHandler = async ({ request }) => {
	const { term, context } = await request.json();

	// Get the AI autocomplete
	const response = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: `Provide a short response for the following term in the flashcard set entitled "${context}": ${term}`,
		temperature: 0.7,
		max_tokens: 70,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	let definition;

	// If we get choices back, provide the first one
	if (response.data.choices) {
		definition = response.data.choices[0].text?.trim();
	} else {
		definition = '';
	}

	// Send back the definition
	return new Response(JSON.stringify({ definition }), { status: 200 });
};
