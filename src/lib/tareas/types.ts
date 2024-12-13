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
		id: string;
		color: string;
		nombre_completo: string;
	};
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
