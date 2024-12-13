import { createClient } from "@/utils/supabase/server";
import type { EntornosFromUsuario } from "./types";

export async function getEntornosbyUsuario() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data } = await supabase
			.from("Usuarios_Entornos")
			.select("admin, Entornos(*)")
			.eq("usuario", user.id);
		if (data) {
			return data as EntornosFromUsuario;
		}
	}
}

export async function getEquiposByIdUsuario(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Usuarios_Equipos").select("Equipos(*)").eq("usuario", id);

	return data;
}

export async function getProyectosbyEntornos(entornos: EntornosFromUsuario) {
	const proyectos = entornos.reduce(
		(acc, entorno) => {
			if (entorno.Entornos.entorno) {
				if (!acc[entorno.Entornos.entorno]) {
					acc[entorno.Entornos.entorno] = [];
				}
				acc[entorno.Entornos.entorno].push({
					id: entorno.Entornos.id,
					nombre: entorno.Entornos.nombre,
					slug: entorno.Entornos.slug,
				});
			}
			return acc;
		},
		{} as Record<string, { id: string; nombre: string; slug: string }[]>,
	);
	return proyectos;
}
