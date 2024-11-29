import AjustesTarea from "@/components/tareas/ajustes-tarea";
import ComentariosTarea from "@/components/tareas/comentarios-tarea";
import DescripcionTarea from "@/components/tareas/descripcion-tarea";
import { getComentariosByTarea, getTareaBySlug, getUsuariosByTarea } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Tarea({ params }: { params: Promise<{ tarea: string }> }) {
	const tareaSlug = (await params).tarea;
	const tarea = await getTareaBySlug(tareaSlug);
	if (!tarea) return notFound();

	const usuarios = await getUsuariosByTarea(tarea.id);

	const comentarios = await getComentariosByTarea(tarea.id);

	return (
		<div className="grid h-[calc(100vh-70px)] grid-cols-4">
			<div className="col-span-3 overflow-y-scroll p-8">
				<h1 className="text-3xl font-bold">{tarea.titulo}</h1>
				<AjustesTarea tarea={tarea} usuarios={usuarios} />
				<DescripcionTarea descripcion={tarea.descripcion} idTarea={tarea.id} />
			</div>
			<div className="flex flex-col justify-stretch border-l border-neutral-800">
				<ComentariosTarea comentarios={comentarios} idTarea={tarea.id} />
			</div>
		</div>
	);
}
