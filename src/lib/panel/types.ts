export type EntornosFromUsuario = {
	admin: boolean;
	Entornos: {
		color: string;
		descripcion: string | null;
		entorno: string | null;
		equipo: string | null;
		id: string;
		nombre: string;
		propietario: string;
		slug: string;
	};
}[];

export type EquiposFromUsuario = {
	Equipos: {
		color: string;
		created_at: string;
		id: string;
		nombre: string;
		slug: string;
	} | null;
}[];
