import type { RequestHandler } from '@sveltejs/kit';
import { image_search } from 'duckduckgo-images-api';

export const POST: RequestHandler = async ({ request }) => {
	const { term } = await request.json();

	const images = (await image_search({ query: term + ' icon', moderate: true })) || [];
	images.splice(10);

	return new Response(JSON.stringify({ images }), { status: 200 });
};
