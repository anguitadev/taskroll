import { createClient } from "@/utils/supabase/server";
import { getUsuario } from "../auth/data";
import { getTareasByEquipoId } from "../tareas/data";

export async function getEquipoBySlug(equipoSlug: string) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Equipos")
		.select("id")
		.eq("slug", equipoSlug)
		.limit(1)
		.single();

	return data;
}

export async function isUsuarioInEquipo(equipoSlug: string) {
	const usuario = await getUsuario();
	if (!usuario) return false;

	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return false;

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("*")
		.eq("equipo", equipo.id)
		.eq("usuario", usuario.id)
		.limit(1)
		.single();

	return !!data;
}

export async function getUsuariosWithTareaCountByEquipoSlug(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return [];

	const tareas = await getTareasByEquipoId(equipo.id);
	if (!tareas) return [];

	const tareasIds = tareas.map(tarea => tarea.tarea.id);

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("usuario:Usuarios(nombre_usuario)")
		.in("tarea", tareasIds);

	// Número de tareas por nombre de usuario
	const usuariosTareas: { usuario: string; tareas: number; fill: string }[] = data
		? Object.values(
				data.reduce(
					(acc, item) => {
						if (item.usuario?.nombre_usuario && !acc[item.usuario?.nombre_usuario]) {
							acc[item.usuario?.nombre_usuario] = {
								usuario: item.usuario?.nombre_usuario,
								tareas: 0,
								fill: `var(--color-${item.usuario?.nombre_usuario})`,
							};
						}
						if (item.usuario?.nombre_usuario)
							acc[item.usuario?.nombre_usuario].tareas += 1;
						return acc;
					},
					{} as Record<string, { usuario: string; tareas: number; fill: string }>,
				),
			)
		: [];

	return usuariosTareas;
}

export async function isUsuarioEquipoAdmin(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);

	const usuario = await getUsuario();
	if (!equipo || !usuario) return false;

	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("*")
		.eq("equipo", equipo.id)
		.eq("usuario", usuario.id)
		.eq("admin", true);

	return data ? data.length > 0 : false;
}

export async function getEquipoById(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Equipos").select("*").eq("id", id).limit(1).single();

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

export async function getAdminCountEquipo(equipoId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("admin")
		.eq("equipo", equipoId)
		.eq("admin", true);

	return data ? data.length : 0;
}

export async function isEquipoAdminByUsuarioId(usuarioId: string, equipoId: string) {
	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("admin")
		.eq("equipo", equipoId)
		.eq("usuario", usuarioId)
		.eq("admin", true)
		.limit(1)
		.single();

	return data ? data.admin : false;
}
