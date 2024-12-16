"use server";
import CorreoNotificacion from "@/components/emails/tamplate";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";
import { getUsuario } from "../auth/data";
import { getTareaUrlById, getUsuariosByTarea } from "../tareas/data";
import { UsuariosTareas } from "../tareas/types";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function enviarCorreosUsuarios(
	usuariosTarea: UsuariosTareas[],
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
