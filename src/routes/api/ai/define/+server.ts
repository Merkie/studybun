import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { term, context, userId } = await request.json();

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
		if (response.data.total_tokens) {
			await client.user.update({
				where: {
					id: userId
				},
				data: {
					used_openai_tokens: {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						increment: response.data.total_tokens
					}
				}
			});
		}
	} else {
		description = '';
	}

	// Send back the description
	return new Response(JSON.stringify({ description }), { status: 200 });
};
