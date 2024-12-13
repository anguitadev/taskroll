import { createClient } from "@/utils/supabase/client";
import { Enlace, Tarea, UsuariosTareas } from "./types";

export async function getTareaLinkById(tareaId: string) {
	const supabase = createClient();

	const { data } = await supabase
		.from("Tareas")
		.select("slug, entorno:Entornos(slug, entorno(slug, equipo:Equipos(slug)))")
		.eq("id", tareaId)
		.limit(1)
		.single();
	if (data) {
		return data as unknown as Enlace;
	}
}

export async function getUsuariosByTarea(tareaId: string) {
	const supabase = createClient();
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("Usuarios(*)")
		.eq("tarea", tareaId);

	return data as unknown as UsuariosTareas[];
}

export async function getTareasByProyectoSlug(idProyecto: string) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return;

	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("tarea:Tareas(id, titulo, slug, fecha_fin, estado, prioridad)")
		.eq("usuario", user.id)
		.eq("tarea.entorno", idProyecto);

	return data as unknown as Tarea[];
}