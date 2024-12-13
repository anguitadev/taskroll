import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";

type Usuarios = {
	Usuarios: {
		color: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	};
};

export async function createTarea(
	titulo: string,
	estado: string,
	prioridad: string,
	fecha_fin: string,
	idProyecto: string,
	usuarios: Usuarios[],
) {
	const supabase = createClient();
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
	const supabase = createClient();
	const { error } = await supabase.from("Tareas").delete().eq("id", idTarea);
	if (error) throw error;
}
