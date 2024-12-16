export interface Tarea {
	usuario: { color: string; nombre_completo: string };
	tarea: {
		id: string;
		titulo: string;
		slug: string;
		fecha_fin: string;
		estado: string;
		prioridad: string;
		entorno: {
			nombre: string;
			entorno: {
				nombre: string;
			};
		};
	};
}

export type UsuariosTareas = {
	Usuarios: {
		color: string;
		email: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	} | null;
};

export type Enlace = {
	slug: string;
	entorno: {
		slug: string;
		entorno: {
			slug: string;
			equipo: {
				slug: string;
			};
		};
	};
};

export type Usuarios = {
	Usuarios: {
		color: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	};
};
 export type Comentario = {
	comentario: string;
	created_at: string;
	id: string;
	tarea: string;
	usuario: string;
	Usuarios: {
		nombre_completo: string;
		color: string;
	} | null;
};