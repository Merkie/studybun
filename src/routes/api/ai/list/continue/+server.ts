import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';
import { increment_user_tokens } from '$lib/api/server';

export const POST: RequestHandler = async ({ request }) => {
	const { terms, context, session } = await request.json();

	// If the user is not logged in, return an error
	if (!session || !session.user) {
		return new Response(JSON.stringify({ terms: [] }), { status: 200 });
	}

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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		increment_user_tokens(session, response.data.usage.total_tokens);
	}

	const termsEdited = continuedTerms.map((term: string) => {
		return term.trim();
	});

	// Send back the description
	return new Response(JSON.stringify({ terms: termsEdited }), { status: 200 });
};
