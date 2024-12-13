import { createClient } from "@/utils/supabase/client";
import { Tarea } from "./tareas/types";

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

export async function getUsuariosFromProyecto(proyectoId: string) {
	const supabase = createClient();
	const { data: usuarios } = await supabase
		.from("Usuarios_Entornos")
		.select("Usuarios(*)")
		.eq("entorno", proyectoId)
		.order("usuario.nombre_completo", { ascending: true });

	return usuarios;

	// if (!usuarios) return null;

	// const ids = usuarios.filter(item => item.usuario !== null).map(item => item.usuario);

	// if (ids) {
	// 	const { data: usuarios } = await supabase
	// 		.from("Usuarios")
	// 		.select("*")
	// 		.in("id", ids)
	// 		.order("nombre_completo", { ascending: true });
	// 	return usuarios;
	// }
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
					id: string;
				};
			};
		};
	};
}

export async function getNotificacionNumberByEquipo(idEquipo: string) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return 0;

	const { data } = await supabase
		.from("Notificaciones")
		.select(
			"id, notificacion, created_at, tarea:Tareas(estado, titulo, slug, entorno:Entornos(slug, entorno(slug, equipo:Equipos(id))))",
		)
		.eq("usuario_destinatario", user.id);

	if (!data) return 0;

	const notificaciones = data as unknown as Notificacion[];

	const notificacionesEquipo = notificaciones.filter(
		notificacion => notificacion.tarea.entorno.entorno.equipo.id == idEquipo,
	);

	return notificacionesEquipo.length;
}

export async function removeComentario(idComentario: string) {
	const supabase = createClient();
	const { error } = await supabase.from("Comentarios").delete().eq("id", idComentario);
	if (error) throw error;
}

// interface Tarea {
// 	usuario: {
// 		color: string;
// 		nombre_completo: string;
// 	} | null;
// 	tarea: {
// 		id: string;
// 		titulo: string;
// 		slug: string;
// 		fecha_fin: string;
// 		estado: string;
// 		prioridad: string;
// 		entorno: {
// 			nombre: string;
// 			entorno: {
// 				nombre: string;
// 			};
// 		};
// 	} | null;
// }

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

interface UsuariosTareas {
	Usuarios: {
		id: string;
		color: string;
		nombre_completo: string;
	};
}

export async function getUsuariosByTarea(tareaId: string) {
	const supabase = createClient();
	const { data } = await supabase
		.from("Usuarios_Tareas")
		.select("Usuarios(*)")
		.eq("tarea", tareaId);

	return data as unknown as UsuariosTareas[];
}

export async function getUsuario() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data } = await supabase
			.from("Usuarios")
			.select("*")
			.eq("id", user.id)
			.limit(1)
			.single();
		if (data) {
			return data;
		}
	}
}

type Enlace = {
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

export async function getEquipoBySlug(equipoSlug: string) {
	const supabase = createClient();

	const { data } = await supabase
		.from("Equipos")
		.select("id")
		.eq("slug", equipoSlug)
		.limit(1)
		.single();

	const usuario = await getUsuario();

	const { data: usuario_equipo } = await supabase
		.from("Usuarios_Equipos")
		.select("*")
		.eq("equipo", data?.id)
		.eq("usuario", usuario?.id)
		.limit(1)
		.single();

	if (usuario_equipo) {
		return data;
	}
}

export async function getEntornosByEquipoSlug(equipoSlug: string) {
	const supabase = createClient();

	const equipo = await getEquipoBySlug(equipoSlug);

	const usuario = await getUsuario();

	const { data: usuarios_entornos } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno")
		.eq("usuario", usuario.id);

	const entornoIds = usuarios_entornos?.map(entorno => entorno.entorno);

	const { data } = await supabase
		.from("Entornos")
		.select("id, nombre, equipo:Equipos(slug)")
		.is("entorno", null)
		.eq("equipo", equipo?.id)
		.in("id", entornoIds!);

	return data;
}

export async function getProyectosByEntornoId(id: string) {
	const supabase = createClient();

	const usuario = await getUsuario();

	const { data: usuarios_entornos } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno")
		.eq("usuario", usuario.id);

	const entornoIds = usuarios_entornos?.map(entorno => entorno.entorno);

	const { data } = await supabase
		.from("Entornos")
		.select("*")
		.eq("entorno", id)
		.in("id", entornoIds!);

	return data;
}

export async function isUsuarioEquipoAdmin(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);

	const usuario = await getUsuario();

	if (!equipo || !usuario) return false;

	const supabase = createClient();

	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("*")
		.eq("equipo", equipo.id)
		.eq("usuario", usuario.id)
		.eq("admin", true);

	return data ? data.length > 0 : false;
}

type Nominas =
	| {
			created_at: string;
			destinatario: string | null;
			entorno: {
				slug: string;
				nombre: string;
				entorno: {
					slug: string;
					nombre: string;
					entorno: {
						slug: string;
						nombre: string;
					};
				} | null;
			} | null;
			id: string;
			nombre: string;
			propietario: string;
			url: string;
	  }[]
	| null
	| undefined;

export async function getNominasByUsuarioId(usuarioId: string) {
	const supabase = createClient();

	const usuario = await getUsuario();
	if (!usuario) return;

	const { data: usuarios_equipos } = await supabase
		.from("Usuarios_Equipos")
		.select("id")
		.eq("usuario", usuario.id)
		.eq("admin", true);

	if (!usuarios_equipos) return;

	const { data } = await supabase
		.from("Documentos")
		.select("*")
		.eq("destinatario", usuarioId)
		.eq("propietario", usuario.id);

	if (data) return data as unknown as Nominas;
}

export async function getMarcajesByUsuarioId(usuarioId: string) {
	const supabase = createClient();

	const { data, error } = await supabase.from("Marcajes").select("*").eq("usuario", usuarioId);

	if (error) throw error;

	return data;
}

export async function getIncidenciasByUsuarioId(usuarioId: string) {
	const supabase = createClient();

	const { data, error } = await supabase.from("Incidencias").select("*").eq("usuario", usuarioId);

	if (error) throw error;

	return data;
}

export async function getEntornosWhereUsuarioAdminByEquipoSlug(equipoSlug: string) {
	const supabase = createClient();

	const usuario = await getUsuario();

	const equipo = await getEquipoBySlug(equipoSlug);

	if (!equipo || !usuario) return [];

	const { data, error } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno:Entornos(*)")
		.eq("usuario", usuario.id)
		.eq("admin", true)
		.eq("entorno.equipo", equipo.id)
		.not("entorno", "is", null);

	if (error) throw error;

	return data;
}