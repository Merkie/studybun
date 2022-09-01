import { Configuration, OpenAIApi } from 'openai';

// OpenAI configuration
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});

// OpenAI Object
export const openai = new OpenAIApi(configuration);
