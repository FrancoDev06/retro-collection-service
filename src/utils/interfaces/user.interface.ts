export interface UserRegisterRequest {
	name: string;
	email: string;
	password: string;
}

export interface UserLoginRequest {
	email: string;
	password: string;
}

export interface UserInfoResponse {
	userId: string;
	username: string;
	email: string;
	passwordHash: string;
}
