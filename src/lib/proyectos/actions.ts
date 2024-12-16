import { createClient } from "@/utils/supabase/server";
import { getAdminCountEntorno, isEntornoAdminByUsuarioId } from "../entornos/data";
import { removeTarea, removeUserFromTarea } from "../tareas/actions";
import { getTareasByEntornoId, getUsuariosByTareaId } from "../tareas/data";

export async function removeUsuarioProyecto(usuarioId: string, proyectoId: string) {
	let adminCount = await getAdminCountEntorno(proyectoId);
	const isAdmin = await isEntornoAdminByUsuarioId(usuarioId, proyectoId);

	if (isAdmin) adminCount--;

	if (adminCount == 0) throw new Error("El proyecto debe tener al menos un admin");

	const tareasProyecto = await getTareasByEntornoId(proyectoId);

	if (tareasProyecto) {
		for (const tarea of tareasProyecto) {
			const usuariosTarea = await getUsuariosByTareaId(tarea.id);
			if (usuariosTarea && usuariosTarea.find(usuario => usuario.Usuarios?.id == usuarioId)) {
				if (usuariosTarea.length > 1) {
					try {
						await removeUserFromTarea(tarea.id, usuarioId);
					} catch (error) {
						if (error)
							throw new Error(
								"No se pudo eliminar el usuario de la tarea " + tarea.titulo,
							);
					}
				} else {
					try {
						await removeTarea(tarea.id);
					} catch (error) {
						if (error) throw new Error("No se pudo eliminar la tarea");
					}
				}
			}
		}
	}

	const supabase = await createClient();
	const { error } = await supabase
		.from("Usuarios_Entornos")
		.delete()
		.eq("entorno", proyectoId)
		.eq("usuario", usuarioId);

	if (error) throw error;
}
