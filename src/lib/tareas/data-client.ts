import { createClient } from "@/utils/supabase/client";
import { Enlace, UsuariosTareas } from "./types";

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
