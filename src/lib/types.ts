export interface IUser {
	name: string;
	image: string;
	user_id: string;
}

export interface IDefineRequest {
	term: string;
	context: string;
}

export interface IDefineResponse {
	definition: string;
}
