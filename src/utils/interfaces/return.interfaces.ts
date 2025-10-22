export interface RequestReturn<T> {
	info: string;
	additional?: string;
	data?: T;
};

export interface RequestError extends RequestReturn<null> {
	error: string;
};
