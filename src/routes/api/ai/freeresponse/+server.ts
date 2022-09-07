import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';

export const POST: RequestHandler = async ({ request }) => {
	const { term, definition, response } = await request.json();

	// Get the AI autocomplete
	const openai_response = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: `Grade the following response given the context as correct or incorrect. Provide only one word response.\nPrompt: ${term}\nCorrect Response: ${definition}\nUser Response: ${response}\nFeedback:`,
		temperature: 0.7,
		max_tokens: 70,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	let feedback = '';
	let booleanScore = true;

	// If we get choices back, provide the first one
	if (openai_response.data.choices) {
		feedback = openai_response.data.choices[0].text?.trim().toUpperCase() || '';
		console.log(feedback);
		if (feedback.includes('INCORRECT')) {
			booleanScore = false;
		}
	}

	// Send back the description
	return new Response(JSON.stringify({ feedback: booleanScore }), { status: 200 });
};
