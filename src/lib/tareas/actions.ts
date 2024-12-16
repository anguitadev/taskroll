"use server"
import { createClient } from "@/utils/supabase/server";
import { getUsuario } from "../auth/data";
import { createNotificacion } from "../notificaciones/actions";
import { UsuariosTareas } from "./types";

type Usuarios = {
	Usuarios: {
		color: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	};
}[];

export async function createTarea(
	titulo: string,
	estado: string,
	prioridad: string,
	fecha_fin: string,
	idProyecto: string,
	usuarios: Usuarios,
) {
	const supabase = await createClient();
	const usuario = await getUsuario();
	if (!usuario) return;

	let tareaSlug = titulo
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-");

	const { data: tarea } = await supabase.from("Tareas").select("*").like("slug", tareaSlug);

	if (tarea && tarea.length > 0) {
		tareaSlug += "-" + tarea.length;
	}

	const { data: idTarea, error } = await supabase
		.from("Tareas")
		.insert({
			titulo: titulo,
			slug: tareaSlug,
			estado: estado,
			prioridad: prioridad,
			fecha_fin: fecha_fin,
			entorno: idProyecto,
			propietario: usuario.id,
		})
		.select("id")
		.single();

	if (error) throw error;

	if (usuarios && usuarios.length > 0) {
		usuarios.map(async usuario => {
			const { error } = await supabase.from("Usuarios_Tareas").insert({
				tarea: idTarea.id,
				usuario: usuario.Usuarios!.id,
			});
			if (error) throw error;
		});
	}
}

export async function deleteTarea(idTarea: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Tareas").delete().eq("id", idTarea);
	if (error) throw error;
}

export async function deleteTareaBySlug(slugTarea: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Tareas").delete().eq("slug", slugTarea);
	if (error) throw error;
}

export async function updateTituloTarea(idTarea: string, titulo: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Tareas").update({ titulo: titulo }).eq("id", idTarea);
	if (error) throw error;
}

export async function updateDescripcionTarea(idTarea: string, descripcion: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("Tareas")
		.update({ descripcion: descripcion })
		.eq("id", idTarea);

	if (error) return error;
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

export async function cambiarUsuariosTarea(idTarea: string, usuarios: UsuariosTareas[]) {
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

		if (deleteError) console.log(deleteError);
	}

	const usuariosToAdd = newUsuariosIds.filter(id => !currentUsuariosIds.includes(id));

	console.log(newUsuariosIds);

	if (usuariosToAdd.length > 0) {
		const { error: insertError } = await supabase
			.from("Usuarios_Tareas")
			.insert(usuariosToAdd.map(id => ({ tarea: idTarea, usuario: id })));

		if (insertError) console.log(insertError);
	}

	const notificacion = " te ha añadido a la tarea.";
	createNotificacion(idTarea, notificacion);
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

export async function removeComentario(idComentario: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Comentarios").delete().eq("id", idComentario);
	if (error) throw error;
}