export type Entorno = {
	color: string;
	descripcion: string | null;
	entorno: string | null;
	equipo: string | null;
	id: string;
	nombre: string;
	propietario: string;
	slug: string;
};

export type UsuariosEntorno = {
	color: string;
	id: string;
	email: string;
	nombre_completo: string;
	nombre_usuario: string;
	puesto: string | null;
};
