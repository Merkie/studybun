import type { RequestHandler } from '@sveltejs/kit';
import { openai } from '$lib/openai';
import { increment_user_tokens } from '$lib/api/server';
import { client } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { context, messages, session } = await request.json();

	if (!session || !session.user) {
		return new Response(JSON.stringify({ description: '' }), { status: 200 });
	}

	// Get the current user obkect
	const user = await client.user.findUnique({
		where: {
			id: session.user.user_id
		}
	});

	// If no user, return false
	if (!user) {
		return new Response(JSON.stringify({ description: '' }), { status: 200 });
	}

	// If no tokens, return false
	if (user.account_plan == 'free' && user.used_openai_tokens > 50000) {
		return new Response(JSON.stringify({ description: '' }), { status: 200 });
	}

	let prompt = `The following is a conversation between a human and an expert in "${context}". The expert is helpful and intelligent:\n`;

	const messagesTrimmed = messages.reverse().splice(0, 10).reverse();

	messagesTrimmed.forEach((message: { bot: boolean; message: string }) => {
		prompt += `${message.bot ? 'Expert' : 'Human'}: ${message.message}\n`;
	});

	prompt += 'Expert: ';

	// Get the AI autocomplete
	const response = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt,
		temperature: 0.7,
		max_tokens: 70,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	console.log(prompt);

	let bot_response;

	// If we get choices back, provide the first one
	if (response.data.choices) {
		bot_response = response.data.choices[0].text?.trim();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		increment_user_tokens(session, response.data.usage.total_tokens);
	} else {
		bot_response = '';
	}

	// Send back the description
	return new Response(JSON.stringify({ response: bot_response }), { status: 200 });
};
