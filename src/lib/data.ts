import { Tables } from "@/db.types";
import { createClient } from "@/utils/supabase/server";

export async function getUsuario() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data } = await supabase
			.from("Usuarios")
			.select("*")
			.eq("id", user.id)
			.limit(1)
			.returns<Tables<"Usuarios">[]>();
		if (data) {
			return data[0];
		}
	}
}

export async function getEquiposByIdUsuario(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Usuarios_Equipos").select("Equipos(*)").eq("usuario", id);

	return data;
}

export async function getEquipoSlugByUsuarioId(id: string) {
	const supabase = await createClient();

	const { data: equipo } = await supabase
		.from("Usuarios_Equipos")
		.select("Equipos(slug)")
		.eq("usuario", id)
		.limit(1);

	return equipo![0].Equipos?.slug;
}

export async function getEquipoById(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Equipos").select("*").eq("id", id).limit(1).single();

	return data;
}

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
			return data;
		}
	}
}

export async function getEntornoBySlug(slug: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Entornos").select("*").eq("slug", slug).limit(1).single();

	return data;
}

export async function getEntornoById(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Entornos").select("*").eq("id", id).limit(1).single();

	return data;
}

export async function getProyectoBySlug(slug: string) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Proyectos")
		.select("*")
		.eq("slug", slug)
		.limit(1)
		.single();

	return data;
}

export async function getEquipoByEntornoId(id: string) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Entornos")
		.select("Equipos(slug)")
		.eq("id", id)
		.limit(1)
		.single();

	return data;
}

export async function getProyectosByEntornoId(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Proyectos").select("*").eq("entorno", id);

	return data;
}

export async function getProyectosbyEntornos(
	entornos: {
		Entornos: {
			color: string;
			descripcion: string | null;
			equipo: string;
			id: string;
			nombre: string;
			propietario: string;
			slug: string;
		} | null;
	}[],
) {
	const supabase = await createClient();

	const ids = entornos.filter(item => item.Entornos !== null).map(item => item.Entornos!.id);

	if (ids.length > 0) {
		const { data } = await supabase
			.from("Proyectos")
			.select("id, nombre, slug, Entornos(id)")
			.in("Entornos.id", ids);
		if (data) {
			const result = data.reduce(
				(acc, item) => {
					const id = item.Entornos?.id;
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
				{} as Record<string, { id: string ,nombre: string; slug: string }[]>,
			);
			return result;
		}
	}
}