import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { getUsuario } from "../auth/data";
import { getEntornosByEquipoId } from "../entornos/data";
import { getEquipoBySlug } from "../equipos/data";
import { Tarea } from "./types";

export async function getTareasByEquipoId(equipoId: string) {
	const supabase = await createClient();

	const usuario = await getUsuario();
	if (!usuario) return;

	const entornos = await getEntornosByEquipoId(equipoId);
	if (!entornos) return;

	// Fetch las tareas del usuario
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select(
			"tarea:Tareas(id, titulo, slug, fecha_fin, estado, prioridad, entorno:Entornos(nombre, slug, entorno))",
		)
		.eq("usuario", usuario.id);
	if (!data) return;

	// Filtra las tareas que pertenecen a los entornos del equipo
	const tareasEntornos = data.filter(tareaObj =>
		entornos.some(entorno => entorno.id === tareaObj?.tarea?.entorno?.entorno),
	);

	return tareasEntornos as unknown as Tarea[];
}

export async function getCompletadoTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	// Filtra las tareas con estado completado
	const completadasTareas = tareas?.filter(tarea => {
		return tarea.tarea?.estado === "Completado";
	});

	return completadasTareas ? completadasTareas.length : 0;
}

export async function getCompletadoTareaSemanaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	// Filtra las tareas con estado completado y fecha fin en los ultimos 7 dias
	const completadasTareas = tareas?.filter(tarea => {
		return (
			tarea.tarea?.estado === "Completado" &&
			moment(tarea.tarea?.fecha_fin).isAfter(moment().subtract(7, "days"))
		);
	});

	return completadasTareas ? completadasTareas.length : 0;
}

export async function getProgresoTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	// Filtra las tareas con estado en progreso
	const progresoTareas = tareas?.filter(tarea => {
		return tarea.tarea?.estado === "Progreso";
	});

	return progresoTareas ? progresoTareas.length : 0;
}

export async function getRevisionTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	// Filtra las tareas con estado en revision
	const revisionTareas = tareas?.filter(tarea => {
		return tarea.tarea?.estado === "Revision";
	});

	return revisionTareas ? revisionTareas.length : 0;
}

export async function getTotalTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	return tareas ? tareas.length : 0;
}

export async function getTotalTareasInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	if (tareas) return tareas;
}

export async function getCompletadoTareasCountByUserId(userId: string, equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);
	if (!tareas) return 0;

	const tareasIds = tareas.map(tarea => tarea.tarea.id);
	if (!tareasIds) return 0;

	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("tarea:Tareas(*)")
		.eq("usuario", userId)
		.eq("tarea.estado", "Completado")
		.in("tarea", tareasIds);

	return data ? data.filter(tarea => tarea.tarea).length : 0;
}

export async function getTareasCountByUserId(userId: string, equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);
	if (!tareas) return 0;

	const tareasIds = tareas.map(tarea => tarea.tarea.id);
	if (!tareasIds) return 0;

	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("*")
		.eq("usuario", userId)
		.in("tarea", tareasIds);

	return data ? data.length : 0;
}

export async function getTareasByProyectoSlug(idProyecto: string) {
	const supabase = await createClient();

	const usuario = await getUsuario();

	if (!usuario) return;

	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("tarea:Tareas(id, titulo, slug, fecha_fin, estado, prioridad)")
		.eq("usuario", usuario.id)
		.eq("tarea.entorno", idProyecto);

	return data as unknown as Tarea[];
}

export async function getEntornoAndProyectoNamesByTareaSlug(tareaSlug: string) {
	const supabase = await createClient();

	const { data: tarea } = await supabase
		.from("Tareas")
		.select("titulo")
		.eq("slug", tareaSlug)
		.limit(1)
		.single();

	const { data: proyecto } = await supabase
		.from("Tareas")
		.select("Entornos(nombre, entorno)")
		.eq("slug", tareaSlug)
		.limit(1)
		.single();

	if (!proyecto?.Entornos?.entorno) return null;

	const { data: entorno } = await supabase
		.from("Entornos")
		.select("nombre")
		.eq("id", proyecto.Entornos.entorno)
		.limit(1)
		.single();

	if (!tarea || !proyecto?.Entornos || !entorno) return null;

	return {
		nombreEntorno: entorno.nombre,
		nombreProyecto: proyecto.Entornos.nombre,
		nombreTarea: tarea.titulo,
	};
}

export async function getComentariosByTarea(tareaId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Comentarios")
		.select("*, Usuarios(nombre_completo, color)")
		.eq("tarea", tareaId)
		.order("created_at", { ascending: false });
	return data;
}

export async function getTareaBySlug(slugTarea: string) {
	const supabase = await createClient();

	const usuario = await getUsuario();

	if (!usuario) return null;

	const { data: tarea } = await supabase
		.from("Tareas")
		.select("*")
		.eq("slug", slugTarea)
		.limit(1)
		.single();

	if (!tarea) return null;

	const { data: usuario_tarea } = await supabase
		.from("Usuarios_Tareas")
		.select("id")
		.eq("tarea", tarea.id)
		.eq("usuario", usuario.id)
		.limit(1)
		.single();

	const { data: usuario_entorno } = await supabase
		.from("Usuarios_Entornos")
		.select("id")
		.eq("entorno", tarea.entorno)
		.limit(1)
		.single();

	if (!usuario_entorno || !usuario_tarea) return null;

	return tarea;
}

export async function getUsuariosByTarea(tareaId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("Usuarios(*)")
		.eq("tarea", tareaId)
		.order("Usuarios(nombre_completo)", { ascending: true });

	return data;
}

export async function getTareaUrlById(idTarea: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Tareas")
		.select("slug, entorno(slug, entorno(slug, equipo(slug)))")
		.eq("id", idTarea)
		.single();

	const slugs = data as unknown as {
		slug: string;
		entorno: {
			slug: string;
			entorno: {
				slug: string;
				equipo: { slug: string };
			};
		};
	};

	return `https://taskroll.app/${slugs?.entorno?.entorno?.equipo?.slug}/${slugs?.entorno?.entorno?.slug}/${slugs?.entorno?.slug}/${slugs?.slug}`;
}

export async function getTareasByEntornoId(entornoId: string) {
	const supabase = await createClient();
	const { data } = await supabase.from("Tareas").select("*").eq("entorno", entornoId);
	return data;
}

export async function getUsuariosByTareaId(tareaId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("Usuarios(*)")
		.eq("tarea", tareaId);
	return data;
}