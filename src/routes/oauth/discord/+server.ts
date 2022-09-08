import type { RequestHandler } from '@sveltejs/kit';
import DiscordOauth2 from 'discord-oauth2';
import { auth } from '$lib/lucia';
import dotenv from 'dotenv';
dotenv.config();

export const GET: RequestHandler = async ({ request }) => {
	const oauth = new DiscordOauth2();
	let tokens;

	// Try and make the request to the discord servers
	try {
		tokens = await oauth.tokenRequest({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			code: request.url.split('?code=')[1],
			scope: 'identify',
			grantType: 'authorization_code',
			redirectUri: process.env.REDIRECT_URI
		});
	} catch (e) {
		return new Response('error', { status: 500 });
	}

	// If we dont get an access token, null
	if (!tokens.access_token) return new Response('error', { status: 500 });

	// Get the user info from discord
	const discordUser = await oauth.getUser(tokens.access_token);

	// If we dont get a user, null
	if (!discordUser) return new Response('error', { status: 500 });

	// Try and get user from database
	const user = await auth.getUser(discordUser.id, discordUser.username);

	if (user) {
		// If we get a user, login the user
		const authenticated_user = await auth.authenticateUser(discordUser.id, discordUser.username);

		// redirect to home
		return new Response('Redirect', {
			status: 303,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			headers: { Location: '/', 'set-cookie': authenticated_user.cookies }
		});
	}

	// Create a new user and redirect home
	const new_user = await auth.createUser(discordUser.id, discordUser.username, {
		user_data: {
			name: discordUser.username,
			image: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp?size=64`
		}
	});

	// Return a redirect
	return new Response('Redirect', {
		status: 303,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		headers: { Location: '/', 'set-cookie': new_user.cookies }
	});
};
