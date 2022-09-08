import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';
import { increment_user_tokens } from '$lib/api/server';

export const POST: RequestHandler = async ({ request }) => {
	const { term, context, userId, session } = await request.json();

	if (!session || !session.user) {
		return new Response(JSON.stringify({ description: '' }), { status: 200 });
	}

	// Get the AI autocomplete
	const response = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: `Provide a short description for the following term in the flashcard set entitled "${context}": ${term}\ndescription: `,
		temperature: 0.7,
		max_tokens: 70,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	let description;

	// If we get choices back, provide the first one
	if (response.data.choices) {
		description = response.data.choices[0].text?.trim();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		increment_user_tokens(session, response.data.usage.total_tokens);
	} else {
		description = '';
	}

	// Send back the description
	return new Response(JSON.stringify({ description }), { status: 200 });
};
