export type FormData = {
	nombreCompleto: string;
	username: string;
	email: string;
	password: string;
};

export type FormErrors = {
	username?: string;
	email?: string;
	password?: string;
};

export interface Usuario {
	admin: boolean;
	Usuarios: {
		color: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	} | null;
}
