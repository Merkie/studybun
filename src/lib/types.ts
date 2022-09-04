export interface IUser {
	name: string;
	id: string;
	image: string;
	user_id: string;
	used_openai_tokens: number;
	account_plan: string;
	created_at: string;
	updated_at: string;
	FlashcardSet: ISet[];
}

export interface IFlashcard {
	id: string;
	term: string;
	description: string;
	hiddenDescriptor: string;
	image: string;
}

export interface ISet {
	id: string;
	author: IUser;
	name: string;
	description: string;
	flashcards: IFlashcard[];
	public: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface IDefineRequest {
	term: string;
	context: string;
}

export interface IDefineResponse {
	definition: string;
}
