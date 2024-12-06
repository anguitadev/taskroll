import { Tables } from "@/db.types";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";

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

interface Tarea {
	usuario: { color: string; nombre_completo: string };
	tarea: {
		id: string;
		titulo: string;
		slug: string;
		fecha_fin: string;
		estado: string;
		prioridad: string;
		entorno: {
			nombre: string;
			entorno: {
				nombre: string;
			};
		};
	};
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

export async function getTareasByEquipoId(equipoId: string) {
	const supabase = await createClient();

	const usuario = await getUsuario();

	if (!usuario) return;

	const entornos = await getEntornosByEquipoId(equipoId);

	if (!entornos) return;

	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select(
			"tarea:Tareas(id, titulo, slug, fecha_fin, estado, prioridad, entorno:Entornos(nombre, slug, entorno))",
		)
		.eq("usuario", usuario.id);

	if (!data) return;

	const tareasEntornos = data.filter(tareaObj =>
		entornos.some(entorno => entorno.id === tareaObj?.tarea?.entorno?.entorno),
	);

	return tareasEntornos as unknown as Tarea[];
}

export async function getEntornosByEquipoId(equipoId: string) {
	const supabase = await createClient();

	const usuario = await getUsuario();

	const { data: usuarios_entornos } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno")
		.eq("usuario", usuario!.id);

	const entornoIds = usuarios_entornos?.map(entorno => entorno.entorno);

	const { data } = await supabase
		.from("Entornos")
		.select("id")
		.is("entorno", null)
		.eq("equipo", equipoId)
		.in("id", entornoIds!);

	return data;
}

export async function getTotalTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	return tareas?.length ?? 0;
}

export async function getProgresoTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	const progresoTareas = tareas?.filter(tarea => {
		return tarea.tarea?.estado === "Progreso";
	});

	return progresoTareas?.length ?? 0;
}

export async function getRevisionTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	const revisionTareas = tareas?.filter(tarea => {
		return tarea.tarea?.estado === "Revision";
	});

	return revisionTareas?.length ?? 0;
}

export async function getCompletadoTareaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	const completadasTareas = tareas?.filter(tarea => {
		return tarea.tarea?.estado === "Completado";
	});

	return completadasTareas?.length ?? 0;
}

export async function getCompletadoTareaSemanaCountInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	const completadasTareas = tareas?.filter(tarea => {
		return (
			tarea.tarea?.estado === "Completado" &&
			moment(tarea.tarea?.fecha_fin).isAfter(moment().subtract(7, "days"))
		);
	});

	return completadasTareas?.length ?? 0;
}

export async function getUsuariosByEquipoSlug(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return [];

	const equipoId = equipo.id;

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("Usuarios(*)")
		.eq("equipo", equipoId);

	return data;
}

export async function getCompletadoTareasCountByUserId(userId: string, equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	const tareasIds = tareas?.map(tarea => tarea.tarea!.id);

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("tarea:Tareas(*)")
		.eq("usuario", userId)
		.eq("tarea.estado", "Completado")
		.in("tarea", tareasIds!);

	return data ? data.filter(tarea => tarea.tarea).length : 0;
}

export async function getTareasCountByUserId(userId: string, equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	const tareasIds = tareas?.map(tarea => tarea.tarea!.id);

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("*")
		.eq("usuario", userId)
		.in("tarea", tareasIds!);

	return data ? data.length : 0;
}

export async function getUsuariosWithTareaCountByEquipoSlug(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return [];

	const tareas = await getTareasByEquipoId(equipo.id);

	const tareasIds = tareas?.map(tarea => tarea.tarea!.id);

	const supabase = await createClient();

	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("usuario:Usuarios(nombre_usuario)")
		.in("tarea", tareasIds!);

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

export async function getTotalTareasInEquipo(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return 0;

	const tareas = await getTareasByEquipoId(equipo.id);

	if (tareas) return tareas;
}

type Documentos =
	| {
			created_at: string;
			destinatario: string | null;
			entorno: {
				slug: string;
				nombre: string;
				entorno: {
					slug: string;
					nombre: string;
					entorno: [Object];
				} | null;
			} | null;
			id: string;
			nombre: string;
			propietario: string;
			url: string;
	  }[]
	| null;

export async function getDocumentosByEquipoSlug(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);

	const supabase = await createClient();

	const usuario = await getUsuario();

	const entornosUsuario = await getEntornosbyUsuario();

	if (entornosUsuario && equipo) {
		const entornosUsuarioEnEquipo = entornosUsuario.filter(async entorno => {
			if (entorno.Entornos) {
				if (entorno.Entornos.entorno === null) {
					return entorno.Entornos.equipo === equipo.id;
				} else {
					const entornoProyecto = await getEntornoById(entorno.Entornos.entorno);
					if (entornoProyecto) return entornoProyecto.equipo === equipo.id;
				}
			}
		});

		const entornosId = entornosUsuarioEnEquipo.map(entorno => entorno.Entornos?.id);

		const entornosIdString = entornosId.join(",");

		const { data } = await supabase
			.from("Documentos")
			.select("*, entorno(nombre, slug, entorno(nombre, slug))")
			.or(`entorno.in.(${entornosIdString}),destinatario.eq.${usuario?.id}`);

		if (data) return data as unknown as Documentos;
	}
}
