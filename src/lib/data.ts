import { Tables } from "@/db.types";
import { createClient } from "@/utils/supabase/server";

export async function getUsuario() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data } = await supabase
			.from("Usuarios")
			.select("*")
			.eq("id", user.id)
			.limit(1)
			.returns<Tables<"Usuarios">[]>();
		if (data) {
			return data[0];
		}
	}
}

export async function getEquiposByIdUsuario(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Usuarios_Equipos").select("Equipos(*)").eq("usuario", id);

	return data;
}

export async function getEquipoSlugByUsuarioId(id: string) {
	const supabase = await createClient();

	const { data: equipo } = await supabase
		.from("Usuarios_Equipos")
		.select("Equipos(slug)")
		.eq("usuario", id)
		.limit(1);

	return equipo![0].Equipos?.slug;
}

export async function getEquipoById(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Equipos").select("*").eq("id", id).limit(1).single();

	return data;
}

export async function getEntornosbyUsuario() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data } = await supabase
			.from("Usuarios_Entornos")
			.select("Entornos(*)")
			.eq("usuario", user.id);
		if (data) {
			return data;
		}
	}
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

export async function getEntornoById(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Entornos").select("*").eq("id", id).limit(1).single();

	return data;
}

export async function getProyectoBySlug(slug: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Entornos").select("*").eq("slug", slug).limit(1).single();

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

export async function getProyectosByEntornoId(id: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Entornos").select("*").eq("entorno", id);

	return data;
}

export async function getProyectosbyEntornos(
	entornos: {
		Entornos: {
			color: string;
			descripcion: string | null;
			entorno: string | null;
			equipo: string | null;
			id: string;
			nombre: string;
			propietario: string;
			slug: string;
		} | null;
	}[],
) {
	const supabase = await createClient();

	const ids = entornos.filter(item => item.Entornos !== null).map(item => item.Entornos!.id);

	if (ids.length > 0) {
		const { data } = await supabase
			.from("Entornos")
			.select("id, nombre, slug, entorno")
			.in("entorno", ids);
		if (data) {
			const result = data.reduce(
				(acc, item) => {
					const id = item.entorno;
					if (id) {
						if (!acc[id]) {
							acc[id] = [];
						}
						acc[id].push({
							id: item.id,
							nombre: item.nombre,
							slug: item.slug,
						});
					}
					return acc;
				},
				{} as Record<string, { id: string; nombre: string; slug: string }[]>,
			);
			return result;
		}
	}
}

export async function getDocumentosByEntornoSlug(entornoSlug: string) {
	const supabase = await createClient();

	const { data: entornoId } = await supabase
		.from("Entornos")
		.select("id")
		.eq("slug", entornoSlug)
		.limit(1)
		.single();

	if (entornoId) {
		const { data } = await supabase.from("Documentos").select("*").eq("entorno", entornoId.id);
		return data;
	}
}

export async function getPizarraFromEntorno(entornoSlug: string) {
	const supabase = await createClient();

	const entorno = await getEntornoBySlug(entornoSlug);

	const { data } = await supabase
		.from("Pizarras")
		.select("contenido")
		.eq("entorno", entorno!.id)
		.limit(1)
		.single();

	return data;
}

export async function getPizarraFromProyecto(proyectoSlug: string) {
	const supabase = await createClient();

	const proyecto = await getProyectoBySlug(proyectoSlug);

	const { data } = await supabase
		.from("Pizarras")
		.select("contenido")
		.eq("entorno", proyecto!.id)
		.limit(1)
		.single();

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

export async function getUsuariosByTarea(tareaId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("Usuarios(*)")
		.eq("tarea", tareaId)
		.order("Usuarios(nombre_completo)", { ascending: true });

	return data;
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

interface Notificacion {
	id: string;
	notificacion: string;
	created_at: string;
	tarea: {
		estado: string;
		titulo: string;
		slug: string;
		entorno: {
			slug: string;
			entorno: {
				slug: string;
				equipo: {
					slug: string;
				};
			};
		};
	};
}

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
