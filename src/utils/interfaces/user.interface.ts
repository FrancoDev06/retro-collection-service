export interface UserRegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface UserLoginRequest {
	email: string;
	password: string;
}

export interface UserInfoResponse {
	id: string;
	ll_username: string;
	ll_email: string;
	ll_password_hash: string;
}
