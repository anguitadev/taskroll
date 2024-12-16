import { Tables } from "@/db.types";
import { createClient } from "@/utils/supabase/server";
import { getEquipoBySlug } from "../equipos/data";

export async function getUsuario() {
	const supabase = await createClient();

    //Recibir usuario loggeado
	const {
		data: { user },
	} = await supabase.auth.getUser();

    // Recibir datos del usuario de la tabla public
	if (user) {
		const { data } = await supabase
			.from("Usuarios")
			.select("*")
			.eq("id", user.id)
			.limit(1)
			.returns<Tables<"Usuarios">[]>()
            .single();
		if (data) {
			return data;
		}
	}
}

export async function getUsuariosByEquipoSlug(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return [];

	const equipoId = equipo.id;

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("admin, equipo, Usuarios(*)")
		.eq("equipo", equipoId);

	return data;
}

export async function getUsuarioById(usuarioId: string) {
	const supabase = await createClient();
	const { data: usuario } = await supabase
		.from("Usuarios")
		.select("*")
		.eq("id", usuarioId)
		.limit(1)
		.single();

	return usuario as Tables<"Usuarios">;
}

export async function getUsuarioByNombreUsuario(nombre_usuario: string) {
	const supabase = await createClient();
	const { data: usuario } = await supabase
		.from("Usuarios")
		.select("*")
		.eq("nombre_usuario", nombre_usuario)
		.limit(1)
		.single();
	if (!usuario) return;
	return usuario;
}