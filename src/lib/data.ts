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

	const { data } = await supabase
	.from("Usuarios_Equipos")
	.select("Equipos(*)")
	.eq("usuario", id);	

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

	const { data } = await supabase
		.from("Equipos")
		.select("*")
		.eq("id", id)
		.limit(1)
		.single();

	return data;
}