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
			.select("Entornos(*)")
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
	const supabase = await createClient();

	const ids = entornos?.filter(item => item !== null).map(item => item.Entornos.id);

	if (ids?.length > 0) {
		const { data } = await supabase
			.from("Entornos")
			.select("id, nombre, slug, entorno")
			.in("entorno", ids);
		if (data) {
			const result = data.reduce(
				(acc, item) => {
					const id = item.entorno;
					if (id) {
						if (!acc[id]) {
							acc[id] = [];
						}
						acc[id].push({
							id: item.id,
							nombre: item.nombre,
							slug: item.slug,
						});
					}
					return acc;
				},
				{} as Record<string, { id: string; nombre: string; slug: string }[]>,
			);
			return result;
		}
	}
}
