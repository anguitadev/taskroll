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
