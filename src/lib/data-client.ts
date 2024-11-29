import { createClient } from "@/utils/supabase/client";

export async function getUsuariosFromEntorno(idEntorno: string) {
	const supabase = createClient();
	const { data: usuarios } = await supabase
		.from("Usuarios_Entornos")
		.select("usuario")
		.eq("entorno", idEntorno);

	if (!usuarios) return null;

	const ids = usuarios.filter(item => item.usuario !== null).map(item => item.usuario);

	if (ids) {
		const { data: usuarios } = await supabase.from("Usuarios").select("*").in("id", ids);
		return usuarios;
	}
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

	notificaciones?.filter(
		notificacion => notificacion.tarea?.entorno?.entorno?.equipo?.id === idEquipo,
	);

	return notificaciones?.length;
}
