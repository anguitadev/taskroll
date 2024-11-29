"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEntornoById, getEquipoByEntornoId, getUsuario, getUsuariosByTarea } from "./data";

export async function createEntorno({
	nombreEntorno,
	descripcionEntorno,
	colorEntorno,
	equipo,
}: {
	nombreEntorno: string;
	descripcionEntorno: string;
	colorEntorno: string;
	equipo: { id: string; nombre: string; slug: string; color: string };
}) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let slug = nombreEntorno
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-");

	const { data: entorno } = await supabase.from("Entornos").select("*").like("slug", slug);

	if (entorno && entorno.length > 0) {
		slug += "-" + entorno.length;
	}

	const { data, error: errorEntornos } = await supabase
		.from("Entornos")
		.insert({
			nombre: nombreEntorno,
			descripcion: descripcionEntorno,
			color: colorEntorno,
			propietario: user!.id,
			slug: slug,
			equipo: equipo.id,
		})
		.select();

	if (!data || errorEntornos) {
		return console.log(errorEntornos);
	}

	await createPizarra(data[0].id);

	const { error } = await supabase.from("Usuarios_Entornos").insert({
		entorno: data![0].id,
		usuario: user!.id,
		admin: true,
	});

	if (error) {
		console.log(error);
	} else {
		revalidatePath("/", "layout");
		redirect("/" + equipo.slug + "/" + data![0].slug);
	}
}

export async function createPizarra(idEntorno: string) {
	const supabase = await createClient();

	const { error } = await supabase.from("Pizarras").insert({
		entorno: idEntorno,
	});

	if (error) {
		console.log(error);
	}
}

export async function createProyecto(
	nombreProyecto: string,
	descripcionProyecto: string,
	idEntorno: string,
) {
	const supabase = await createClient();

	let proyectoSlug = nombreProyecto
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-");

	const { data: proyecto } = await supabase
		.from("Entornos")
		.select("*")
		.like("slug", proyectoSlug);

	if (proyecto && proyecto.length > 0) {
		proyectoSlug += "-" + proyecto.length;
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data: proyectoNuevo, error } = await supabase
		.from("Entornos")
		.insert({
			nombre: nombreProyecto,
			descripcion: descripcionProyecto,
			slug: proyectoSlug,
			entorno: idEntorno,
			propietario: user!.id,
		})
		.select()
		.single();

	if (error) {
		console.log(error);
		return {
			error: error?.code,
		};
	} else {
		createPizarra(proyectoNuevo!.id);

		const entorno = await getEntornoById(idEntorno);

		const equipo = await getEquipoByEntornoId(idEntorno);

		revalidatePath("/");
		redirect("/" + equipo!.Equipos!.slug + "/" + entorno!.slug + "/" + proyectoNuevo!.slug);
	}
}

export async function deleteDocumento(pathname: string) {
	const slugs = pathname.split("/");
	const urlDocumento = slugs.pop();
	const supabase = await createClient();
	const { error } = await supabase.from("Documentos").delete().eq("url", urlDocumento!);
	if (error) {
		return error;
	}
	console.log(pathname);
	revalidatePath(slugs.join("/"));
	redirect(slugs.join("/"));
}

export async function createDocumento(fileKey: string, nombreDocumento: string, pathname: string) {
	const slugs = pathname.split("/");
	const entorno = slugs[slugs.indexOf("documentos") - 1];
	const supabase = await createClient();
	const { data: entornoId } = await supabase
		.from("Entornos")
		.select("id")
		.eq("entorno", entorno)
		.limit(1)
		.single();
	const { error } = await supabase.from("Documentos").insert({
		nombre: nombreDocumento,
		url: fileKey,
		entorno: entornoId!.id,
	});
	if (error) return error;
	revalidatePath(pathname + "/" + fileKey);
	redirect(pathname + "/" + fileKey);
}

export async function updatePizarra(slugEntorno: string, contenido: string) {
	const supabase = await createClient();
	const { data: entorno } = await supabase
		.from("Entornos")
		.select("id")
		.eq("slug", slugEntorno)
		.limit(1)
		.single();
	if (entorno) {
		const { error } = await supabase
			.from("Pizarras")
			.update({ contenido: contenido })
			.eq("entorno", entorno.id);
		if (error) throw error;
	}
}

export async function cambiarEstadoTarea(idTarea: string, estado: string) {
	const supabase = await createClient();
	const { error: errorTarea } = await supabase
		.from("Tareas")
		.update({ estado: estado })
		.eq("id", idTarea);

	if (errorTarea) return errorTarea;

	const notificacion = " ha cambiado el estado de la tarea a " + estado + ".";
	createNotificacion(idTarea, notificacion);
}

export async function cambiarPrioridadTarea(idTarea: string, prioridad: string) {
	const supabase = await createClient();
	const { error: errorTarea } = await supabase
		.from("Tareas")
		.update({ prioridad: prioridad })
		.eq("id", idTarea);

	if (errorTarea) return errorTarea;

	const notificacion = " ha cambiado la prioridad de la tarea a " + prioridad + ".";
	createNotificacion(idTarea, notificacion);
}

export async function cambiarFechaFinal(idTarea: string, fechaFinal: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("Tareas")
		.update({ fecha_fin: fechaFinal })
		.eq("id", idTarea);
	if (error) throw error;

	const notificacion =
		" ha cambiado la fecha final de la tarea a " +
		new Date(fechaFinal).toLocaleDateString() +
		".";
	createNotificacion(idTarea, notificacion);
}

type Usuarios =
	| {
			Usuarios: {
				color: string;
				id: string;
				nombre_completo: string;
				nombre_usuario: string;
				puesto: string | null;
			} | null;
	  }[]
	| null;

export async function cambiarUsuariosTarea(idTarea: string, usuarios: Usuarios) {
	if (!usuarios) return;

	const supabase = await createClient();

	const { data: currentUsuariosTarea } = await supabase
		.from("Usuarios_Tareas")
		.select("usuario")
		.eq("tarea", idTarea);

	if (!currentUsuariosTarea) return;

	const currentUsuariosIds = currentUsuariosTarea.map(item => item.usuario);
	const newUsuariosIds = usuarios.map(item => item.Usuarios!.id);

	const usuariosToRemove = currentUsuariosIds.filter(id => !newUsuariosIds.includes(id));

	if (usuariosToRemove.length > 0) {
		const { error: deleteError } = await supabase
			.from("Usuarios_Tareas")
			.delete()
			.eq("tarea", idTarea)
			.in("usuario", usuariosToRemove);

		if (deleteError) throw deleteError;
	}

	const upsertData = usuarios.map(item => ({
		tarea: idTarea,
		usuario: item.Usuarios!.id,
	}));

	const { error: upsertError } = await supabase.from("Usuarios_Tareas").upsert(upsertData);

	if (upsertError) throw upsertError;

	const notificacion = " te ha añadido a la tarea.";
	createNotificacion(idTarea, notificacion);
}

export async function updateDescripcionTarea(idTarea: string, descripcion: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("Tareas")
		.update({ descripcion: descripcion })
		.eq("id", idTarea);

	if (error) return error;
}

export async function addComentario(idTarea: string, comentario: string) {
	const supabase = await createClient();
	const usuario = await getUsuario();
	if (!usuario) return;
	const { data, error } = await supabase
		.from("Comentarios")
		.insert({
			tarea: idTarea,
			comentario: comentario,
			usuario: usuario.id,
		})
		.select("*, Usuarios(nombre_completo, color)");
	if (error) {
		return error;
	} else {
		const notificacion = " ha hecho un comentario en la tarea.";
		createNotificacion(idTarea, notificacion);

		return data;
	}
}

export async function createNotificacion(idTarea: string, notificacion: string) {
	const usuario = await getUsuario();

	if (!usuario) return;

	const supabase = await createClient();

	const usuariosTarea = await getUsuariosByTarea(idTarea);

	if (!usuariosTarea) return;

	usuariosTarea.forEach(async item => {
		if (item.Usuarios!.id === usuario.id) return;
		const { error: errorNotificacion } = await supabase.from("Notificaciones").insert({
			notificacion: usuario.nombre_completo + notificacion,
			usuario_origen: usuario.id,
			usuario_destinatario: item.Usuarios!.id,
			tarea: idTarea,
		});
		if (errorNotificacion) return errorNotificacion;
	});
}

export async function removeNotificacion(idNotificacion: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Notificaciones").delete().eq("id", idNotificacion);
	if (error) return error;
}
