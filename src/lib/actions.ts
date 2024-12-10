"use server";

import CorreoNotificacion from "@/components/emails/tamplate";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { UTApi } from "uploadthing/server";
import {
	getEntornoById,
	getEquipoByEntornoId,
	getEquipoBySlug,
	getUsuario,
	getUsuarioByNombreUsuario,
	getUsuariosByEquipoSlug,
	getUsuariosByTarea,
} from "./data";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function createDocumento(
	fileKey: string,
	nombreDocumento: string,
	pathname: string,
	destinatario?: string,
) {
	if (pathname === "nomina" && destinatario) {
		const usuario = await getUsuario();
		const supabase = await createClient();
		const { error } = await supabase.from("Documentos").insert({
			nombre: nombreDocumento,
			url: fileKey,
			propietario: usuario!.id,
			destinatario: destinatario,
		});
		if (error) return error;
	} else {
		const slugs = pathname.split("/");
		const entorno = slugs[slugs.indexOf("documentos") - 1];

		if (entorno) {
			const supabase = await createClient();

			const { data: entornoId } = await supabase
				.from("Entornos")
				.select("id")
				.eq("slug", entorno)
				.limit(1)
				.single();

			if (entornoId) {
				const usuario = await getUsuario();
				const { error } = await supabase.from("Documentos").insert({
					nombre: nombreDocumento,
					url: fileKey,
					entorno: entornoId!.id,
					propietario: usuario!.id,
				});
				if (error) return error;
			}
		}
	}
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

	const textoNotificacion = usuario.nombre_completo + notificacion;

	usuariosTarea.forEach(async item => {
		if (item.Usuarios!.id === usuario.id) return;
		const { error: errorNotificacion } = await supabase.from("Notificaciones").insert({
			notificacion: textoNotificacion,
			usuario_origen: usuario.id,
			usuario_destinatario: item.Usuarios!.id,
			tarea: idTarea,
		});
		if (errorNotificacion) return errorNotificacion;
	});

	enviarCorreosUsuarios(usuariosTarea, textoNotificacion, idTarea);
}

export async function removeNotificacion(idNotificacion: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Notificaciones").delete().eq("id", idNotificacion);
	if (error) return error;
}

export async function updateTituloTarea(idTarea: string, titulo: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Tareas").update({ titulo: titulo }).eq("id", idTarea);
	if (error) throw error;
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

export async function deleteAllNotificaciones() {
	const supabase = await createClient();

	const usuario = await getUsuario();

	if (!usuario) return;

	const { error } = await supabase
		.from("Notificaciones")
		.delete()
		.eq("usuario_destinatario", usuario.id);
	if (error) throw error;
}

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

export async function deleteDocumentoByUrl(documentoUrl: string) {
	const utapi = new UTApi();
	await utapi.deleteFiles(documentoUrl);
	const supabase = await createClient();
	const { error } = await supabase.from("Documentos").delete().eq("url", documentoUrl);
	if (error) throw error;
}

type Usuario = {
	Usuarios: {
		color: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
		email: string;
	} | null;
};

export async function enviarCorreosUsuarios(
	usuariosTarea: Usuario[],
	notificacion: string,
	idTarea: string,
) {
	const tareaUrl = await getTareaUrlById(idTarea);

	const usuarioLogged = await getUsuario();

	const correos = usuariosTarea.filter(usuario => {
		return (
			usuario.Usuarios &&
			usuario.Usuarios.email &&
			usuario.Usuarios.email !== usuarioLogged?.email
		);
	});

	if (correos) {
		correos.map(async usuario => {
			if (!usuario.Usuarios || !usuario.Usuarios.email) return;
			const { error } = await resend.emails.send({
				from: "Taskroll <no-reply@taskroll.app>",
				to: [usuario.Usuarios.email],
				subject: "Notificación",
				react: CorreoNotificacion({
					nombre_completo: usuario.Usuarios!.nombre_completo,
					notificacion: notificacion,
					tareaUrl: tareaUrl,
				}),
			});

			if (error) {
				console.log(error);
			}
		});
	}
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

export async function updateUsuarioRolEquipo(newRol: string, idUsuario: string, idEquipo: string) {
	const adminCount = await getAdminCountEquipo(idEquipo);

	if (newRol == "miembro" && adminCount == 1)
		throw new Error("El equipo debe tener al menos un admin");

	const supabase = await createClient();

	const rol = newRol === "admin" ? true : false;

	const { error } = await supabase
		.from("Usuarios_Equipos")
		.update({ admin: rol })
		.eq("equipo", idEquipo)
		.eq("usuario", idUsuario);

	if (error) throw error;
}

export async function getAdminCountEquipo(idEquipo: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Equipos")
		.select("admin")
		.eq("equipo", idEquipo)
		.eq("admin", true);

	return data ? data.length : 0;
}

export async function removeUsuarioEquipo(usuarioId: string, equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) return;
	const usuarioCount = await getUsuarioCountEquipo(equipo.id);

	if (usuarioCount == 1) throw new Error("El equipo debe tener al menos un usuario");

	const supabase = await createClient();
	const { error } = await supabase
		.from("Usuarios_Equipos")
		.delete()
		.eq("equipo", equipo.id)
		.eq("usuario", usuarioId);

	if (error) throw error;
}

export async function getUsuarioCountEquipo(idEquipo: string) {
	const supabase = await createClient();
	const { data } = await supabase.from("Usuarios_Equipos").select("admin").eq("equipo", idEquipo);

	return data ? data.length : 0;
}

export async function addUsuarioToEquipo(nombre_usuario: string, equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) throw new Error("Equipo no encontrado");

	const usuario = await getUsuarioByNombreUsuario(nombre_usuario);
	if (!usuario) throw new Error("Usuario no encontrado");

	const usuariosEquipo = await getUsuariosByEquipoSlug(equipoSlug);

	if (usuariosEquipo?.find(user => user.Usuarios?.id === usuario.id)) {
		throw new Error("El usuario ya pertenece al equipo");
	}

	const supabase = await createClient();
	const { error } = await supabase.from("Usuarios_Equipos").insert({
		equipo: equipo.id,
		usuario: usuario.id,
		admin: false,
	});

	if (error) throw new Error("Ha habido un error al asignar el usuario.");
}

export async function deleteIncidenciaById(incidenciaId: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Incidencias").delete().eq("id", incidenciaId);
	if (error) throw error;
}