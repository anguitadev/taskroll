import { createClient } from "@/utils/supabase/server";
import { getEquipoBySlug } from "../equipos/data";
import { Notificacion } from "./types";

export async function getNotificacionesByEquipoSlug(equipoSlug: string) {
	const supabase = await createClient();

	const equipo = await getEquipoBySlug(equipoSlug);

	if (!equipo) return;

	const { data } = await supabase
		.from("Notificaciones")
		.select(
			"id, notificacion, created_at, tarea:Tareas(estado, titulo, slug, entorno:Entornos(slug, entorno(slug, equipo:Equipos(slug))))",
		)
		.order("created_at", { ascending: false });

	const notificaciones = data as unknown as Notificacion[];

	return notificaciones?.filter(
		notificacion => notificacion.tarea?.entorno?.entorno?.equipo?.slug === equipoSlug,
	);
}
