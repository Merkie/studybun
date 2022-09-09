export interface IUser {
	name: string;
	id: string;
	image: string;
	// user_id: string;
	used_openai_tokens: number;
	account_plan: string;
	created_at: string;
	updated_at: string;
	flashcard_sets: ISet[];
	likes: ILike[];
	comments: IComment[];
	saved_flashcard_sets: string;
	recently_viewed: string;
}

export interface IFlashcard {
	id?: string;
	term: string;
	description: string;
	hiddenDescriptor?: string;
	image?: string;
}

export interface ISet {
	id: string;
	author: IUser;
	name: string;
	description: string;
	flashcards: IFlashcard[];
	public: boolean;
	views: number;
	likes: ILike[];
	comments: Comment[];
	createdAt: string;
	updatedAt: string;
}

export interface ILike {
	id: string;
	user: IUser;
	FlashcardSet: ISet;
}

export interface IComment {
	id: string;
	text: string;
	user: IUser;
	FlashcardSet: ISet;
	replyId?: string;
}
