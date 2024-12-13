import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";
import { Notificacion } from "./types";

export async function getNotificacionNumberByEquipo(idEquipo: string) {
	const supabase = createClient();

	const usuario = await getUsuario();

	// Fetch las notificaciones del usuario
	const { data } = await supabase
		.from("Notificaciones")
		.select(
			"id, notificacion, created_at, tarea:Tareas(estado, titulo, slug, entorno:Entornos(slug, entorno(slug, equipo:Equipos(id))))",
		)
		.eq("usuario_destinatario", usuario.id);

	if (!data) return 0;

	const notificaciones = data as unknown as Notificacion[];

	// Filtrar las notificaciones del equipo
	const notificacionesEquipo = notificaciones.filter(
		notificacion => notificacion.tarea.entorno.entorno.equipo.id == idEquipo,
	);

	return notificacionesEquipo.length;
}
