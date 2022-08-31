import lucia from 'lucia-sveltekit';
import prisma from '@lucia-sveltekit/adapter-prisma';
import dotenv from 'dotenv';
import { client } from './prisma';
dotenv.config();

export const auth = lucia({
	adapter: prisma(client),
	secret: process.env.SECRET || 'secret',
	env: 'DEV'
});
