import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";

// export async function getEquipoBySlug(equipoSlug: string) {
//     const supabase = createClient();

//     const { data } = await supabase
//         .from("Equipos")
//         .select("id")
//         .eq("slug", equipoSlug)
//         .limit(1)
//         .single();

//     const usuario = await getUsuario();

//     const { data: usuario_equipo } = await supabase
//         .from("Usuarios_Equipos")
//         .select("*")
//         .eq("equipo", data?.id)
//         .eq("usuario", usuario?.id)
//         .limit(1)
//         .single();

//     if (usuario_equipo) {
//         return data;
//     }
// }

export async function getEquipoBySlug(equipoSlug: string) {
	const supabase = createClient();

	const { data } = await supabase
		.from("Equipos")
		.select("id")
		.eq("slug", equipoSlug)
		.limit(1)
		.single();

	return data;
}

export async function isUsuarioEquipoAdmin(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);

	const usuario = await getUsuario();
	if (!equipo || !usuario) return false;

	const supabase = createClient();
	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("*")
		.eq("equipo", equipo.id)
		.eq("usuario", usuario.id)
		.eq("admin", true);

	return data ? data.length > 0 : false;
}
