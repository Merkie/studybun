/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';
import type { Session } from 'lucia-sveltekit/types';
import { increment_user_tokens } from '$lib/api/server';

export const POST: RequestHandler = async ({ request }) => {
	const { term, response, session } = await request.json();

	if (!session || !session.user) {
		return new Response(JSON.stringify({ feedback: false }), { status: 200 });
	}

	// Get the AI autocomplete
	const openai_response = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: `Grade the following response given the context as correct or incorrect. Provide only one word response.\nPrompt: Define "${term}" in your own words? \nUser Response: ${response}\nFeedback:`,
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
		if (feedback.includes('INCORRECT')) {
			booleanScore = false;
		}
	}

	// @ts-ignore
	// Incrament tokens
	increment_user_tokens(session, openai_response.data.usage.total_tokens);

	// Send back the description
	return new Response(JSON.stringify({ feedback: booleanScore }), { status: 200 });
};
