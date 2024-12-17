import { createClient } from "@/utils/supabase/server";
import { getUsuario } from "../auth/data";
import { getEquipoBySlug } from "../equipos/data";

export async function getEntornosByEquipoId(equipoId: string) {
	const supabase = await createClient();

	const usuario = await getUsuario();
	if (!usuario) return [];

	// Fetch los entornos del usuario
	const { data: usuarios_entornos } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno")
		.eq("usuario", usuario.id);

	// Convertir los IDs de entornos a un array
	const entornoIds = usuarios_entornos?.map(entorno => entorno.entorno);
	if (!entornoIds) return [];

	// Fetch los entornos del equipo
	const { data } = await supabase
		.from("Entornos")
		.select("id")
		.is("entorno", null)
		.eq("equipo", equipoId)
		.in("id", entornoIds);

	return data;
}

export async function getEntornoBySlugAndEquipo(entornoSlug: string, equipoSlug: string) {
	const supabase = await createClient();

	const equipo = await getEquipoBySlug(equipoSlug);

	if (equipo) {
		const { data } = await supabase
			.from("Entornos")
			.select("*")
			.eq("slug", entornoSlug)
			.eq("equipo", equipo.id)
			.is("entorno", null)
			.limit(1)
			.single();

		return data;
	}
}

export async function isEntornoAdmin(entornoId: string) {
	const usuario = await getUsuario();

	if (!usuario) return false;
	const supabase = await createClient();
	const { data: entorno } = await supabase
		.from("Usuarios_Entornos")
		.select("admin")
		.eq("entorno", entornoId)
		.eq("usuario", usuario.id)
		.limit(1)
		.single();
	return entorno?.admin;
}

export async function getEntornoBySlug(entornoSlug: string) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Entornos")
		.select("*")
		.eq("slug", entornoSlug)
		.is("entorno", null)
		.limit(1)
		.single();

	return data;
}

export async function getEntornoById(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Entornos").select("*").eq("id", id).limit(1).single();

	return data;
}

export async function getEntornoProyectoBySlug(entornoSlug: string) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Entornos")
		.select("*")
		.eq("slug", entornoSlug)
		.limit(1)
		.single();

	return data;
}

export async function getUsuariosByEntornoId(entornoId: string) {
	const supabase = await createClient();
	const { data: usuarios } = await supabase
		.from("Usuarios_Entornos")
		.select("admin, entorno, Usuarios(*)")
		.eq("entorno", entornoId);
	return usuarios;
}

export async function getUsuariosByEntornoSlug(entornoSlug: string) {
	const entorno = await getEntornoBySlug(entornoSlug);
	if (!entorno) return [];

	const entornoId = entorno.id;

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Entornos")
		.select("admin, entorno, Usuarios(*)")
		.eq("entorno", entornoId);

	return data;
}

export async function getAdminCountEntorno(entornoId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Entornos")
		.select("admin")
		.eq("entorno", entornoId)
		.eq("admin", true);

	return data ? data.length : 0;
}

export async function isEntornoAdminByUsuarioId(usuarioId: string, entornoId: string) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Entornos")
		.select("admin")
		.eq("entorno", entornoId)
		.eq("usuario", usuarioId)
		.eq("admin", true)
		.limit(1)
		.single();

	return data ? data.admin : false;
}

export async function getAllEntornosByEquipoId(equipoId: string) {
	const supabase = await createClient();
	const { data } = await supabase.from("Entornos").select("*").eq("equipo", equipoId);
	return data;
}

export async function getUsuarioCountByEntornoId(entornoId: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Usuarios_Entornos").select("usuario").eq("entorno", entornoId);

	return data ? data.length : 0;
}
