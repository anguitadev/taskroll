import ListadoTareas from "@/components/proyectos/listado-tareas";
import NuevaTarea from "@/components/tareas/nueva-tarea";
import { getProyectoBySlug } from "@/lib/proyectos/data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Proyecto({
	params,
}: {
	params: Promise<{ equipo: string; entorno: string; proyecto: string }>;
}) {
	const proyectoSlug = (await params).proyecto;
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	const proyecto = await getProyectoBySlug(proyectoSlug);
	if (!proyecto) return notFound();

	return (
		<>
			<div className="my-6 flex w-full border-b border-neutral-700 justify-between items-center">
				<div>
					<Link
						href={`/${equipoSlug}/${entornoSlug}/${proyectoSlug}`}
						className="transitionborder-b cursor-pointer rounded-t border-b-2 border-indigo-600 bg-neutral-800 px-4 py-2"
					>
						Tareas
					</Link>
					<Link
						href={`/${equipoSlug}/${entornoSlug}/${proyectoSlug}/documentos`}
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
					>
						Documentos
					</Link>
					<Link
						href={`/${equipoSlug}/${entornoSlug}/${proyectoSlug}/pizarra`}
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
					>
						Pizarra
					</Link>
				</div>
				<button
					className="mb-2 flex items-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
					popoverTarget={"nueva-tarea-"+proyecto.id}
				>
					<Plus className="size-5" />
					Añadir Tarea
				</button>
			</div>
			<ListadoTareas idProyecto={proyecto.id} />
			<NuevaTarea entorno={proyecto.id} />
		</>
	);
}
