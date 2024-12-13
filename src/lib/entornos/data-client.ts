import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";
import { getEquipoBySlug } from "../equipos/data-client";

export async function getEntornosByEquipoSlug(equipoSlug: string) {
	const supabase = createClient();

	const equipo = await getEquipoBySlug(equipoSlug);

	const usuario = await getUsuario();

	const { data: usuarios_entornos } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno")
		.eq("usuario", usuario.id);

	const entornoIds = usuarios_entornos?.map(entorno => entorno.entorno);
	if (!entornoIds) return [];

	const { data } = await supabase
		.from("Entornos")
		.select("id, nombre, equipo:Equipos(slug)")
		.is("entorno", null)
		.eq("equipo", equipo?.id)
		.in("id", entornoIds);

	return data;
}

export async function getUsuariosFromEntorno(entornoId: string) {
	const supabase = createClient();
	const { data: usuarios } = await supabase
		.from("Usuarios_Entornos")
		.select("usuario")
		.eq("entorno", entornoId);

	if (!usuarios) return null;

	const ids = usuarios.filter(item => item.usuario !== null).map(item => item.usuario);

	if (ids) {
		const { data: usuarios } = await supabase
			.from("Usuarios")
			.select("*")
			.in("id", ids)
			.order("nombre_completo", { ascending: true });
		return usuarios;
	}
}
