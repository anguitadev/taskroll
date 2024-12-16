"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPizarra } from "../entornos/actions";
import { getAdminCountEntorno, getEntornoById, isEntornoAdminByUsuarioId } from "../entornos/data";
import { getEquipoByEntornoId } from "../equipos/data";
import { removeTarea, removeUserFromTarea } from "../tareas/actions";
import { getTareasByEntornoId, getUsuariosByTareaId } from "../tareas/data";

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
