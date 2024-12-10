export type FormData = {
    nombreCompleto: string,
    username: string,
    email: string,
    password: string,
}

export type FormErrors = {
	username?: string;
	email?: string;
	password?: string;
}