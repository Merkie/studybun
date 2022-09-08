import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';
import type { Session } from 'lucia-sveltekit/types';
import { increment_user_tokens } from '$lib/api/server';

export const POST: RequestHandler = async ({ request }) => {
	const { context, session } = await request.json();
	const sess = session as Session;

	// If the user is not logged in, return an error
	if (!sess || !sess.user) {
		return new Response(JSON.stringify({ terms: [] }), { status: 200 });
	}

	// Get the AI autocomplete
	const response = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: `List n number of terms in the following subjects separated by commas and no repeated terms:\nSubject: Programming Fundamentals (3)\nTerms: Comment, Variable, Conditional Statement\nSubject: ${context} (10)\nTerms:`,
		temperature: 0.7,
		max_tokens: 70,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	let terms;

	// If we get choices back, provide the first one
	if (response.data.choices) {
		terms = response.data.choices[0].text?.trim().split(',');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		increment_user_tokens(session, response.data.usage.total_tokens);
	} else {
		terms = [];
	}

	const termsEdited = (terms || []).map((term: string) => {
		return term.trim();
	});

	// Send back the description
	return new Response(JSON.stringify({ terms: termsEdited }), { status: 200 });
};
