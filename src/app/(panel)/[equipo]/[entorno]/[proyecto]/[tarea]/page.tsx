import AjustesTarea from "@/components/tareas/ajustes-tarea";
import ComentariosTarea from "@/components/tareas/comentarios-tarea";
import DescripcionTarea from "@/components/tareas/descripcion-tarea";
import TituloTarea from "@/components/tareas/titulo-tarea";
import { getUsuario } from "@/lib/auth/data";
import { getComentariosByTarea, getTareaBySlug, getUsuariosByTarea } from "@/lib/tareas/data";
import { UsuariosTareas } from "@/lib/tareas/types";
import { notFound } from "next/navigation";

export default async function Tarea({ params }: { params: Promise<{ tarea: string }> }) {
	const tareaSlug = (await params).tarea;

	// Fetch datos de la tarea
	const tarea = await getTareaBySlug(tareaSlug);
	if (!tarea) return notFound();

	// Fetch usuarios de la tarea
	const usuarios: UsuariosTareas[] | null = await getUsuariosByTarea(tarea.id);

	// Fetch comentarios de la tarea
	const comentarios = await getComentariosByTarea(tarea.id);

	// Fetch usuario loggeado
	const usuario = await getUsuario();

	return (
		<div className="grid h-[calc(100vh-70px)] md:grid-cols-4">
			<div className="md:col-span-3 overflow-y-scroll p-3 md:pb-8 md:pt-16 xl:px-16">
				<TituloTarea tituloTarea={tarea.titulo} idTarea={tarea.id} />
				<AjustesTarea tarea={tarea} usuarios={usuarios} />
				<DescripcionTarea descripcion={tarea.descripcion} idTarea={tarea.id} />
			</div>
			<div className="hidden md:flex flex-col justify-stretch border-l border-neutral-800">
				<ComentariosTarea comentarios={comentarios} idTarea={tarea.id} idUsuario={usuario?.id} />
			</div>
		</div>
	);
}
