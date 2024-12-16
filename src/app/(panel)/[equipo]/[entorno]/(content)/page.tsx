import TablaTareas from "@/components/proyectos/tabla-tareas";
import NuevaTarea from "@/components/tareas/nueva-tarea";
import { getEntornoBySlug } from "@/lib/entornos/data";
import { getProyectosByEntornoId } from "@/lib/proyectos/data";
import { getTareasByProyectoSlug } from "@/lib/tareas/data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Entorno({
	params,
}: {
	params: Promise<{ equipo: string; entorno: string }>;
}) {
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	// Fetch entorno
	const entorno = await getEntornoBySlug(entornoSlug);
	if (!entorno) return notFound();

	// Fetch proyectos del entorno
	const proyectosEntorno = await getProyectosByEntornoId(entorno.id);

	async function showTareas(proyectoId: string) {
		const tareas = await getTareasByProyectoSlug(proyectoId);

		let zeroTareas = true;

		// Comprobamos que el objeto contenido dentro de tareas no sea null
		tareas?.forEach(tarea => {
			if (tarea.tarea !== null) {
				zeroTareas = false;
			}
		});

		// Si no hay tareas o el objeto contenido dentro de tareas es null se muestra el mensaje
		if (!tareas || tareas.length === 0 || zeroTareas)
			return (
				<p className="mt-8 text-center text-sm italic text-neutral-400">
					No hay tareas en este proyecto...
				</p>
			);

		// Ordenamos las tareas
		const tareasFiltradas = tareas.filter(tarea => tarea.tarea !== null);

		tareasFiltradas.sort((a, b) => {
			if (a.tarea?.fecha_fin && b.tarea?.fecha_fin) {
				const fechaA = new Date(a.tarea.fecha_fin);
				const fechaB = new Date(b.tarea.fecha_fin);
				return fechaA.getTime() - fechaB.getTime();
			} else {
				return 0;
			}
		});

		return <TablaTareas tareas={tareasFiltradas} />;
	}

	return (
		<>
			<div className="my-6 flex w-full border-b border-neutral-700">
				<Link
					href={`/${equipoSlug}/${entornoSlug}`}
					className="transitionborder-b cursor-pointer rounded-t border-b-2 border-indigo-600 bg-neutral-800 px-4 py-2"
				>
					Tareas
				</Link>
				<Link
					href={`/${equipoSlug}/${entornoSlug}/documentos`}
					className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
				>
					Documentos
				</Link>
				<Link
					href={`/${equipoSlug}/${entornoSlug}/pizarra`}
					className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
				>
					Pizarra
				</Link>
			</div>
			{proyectosEntorno ? proyectosEntorno.map(proyecto => (
				<div key={proyecto.id} className="my-4 rounded border border-neutral-700 p-4">
					<div className="flex justify-between">
						<Link
							href={`/${equipoSlug}/${entornoSlug}/${proyecto.slug}`}
							className="text-xl font-semibold"
						>
							{proyecto.nombre}
						</Link>
						<button
							className="mb-2 flex items-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
							popoverTarget={"nueva-tarea-" + proyecto.id}
						>
							<Plus className="size-5" />
							Añadir Tarea
						</button>
					</div>
					{showTareas(proyecto.id)}
					<NuevaTarea entorno={proyecto.id} />
				</div>
			)) : (
				<span className="block text-center text-sm text-neutral-400">No hay ninguna tarea...</span>
			)}
		</>
	);
}
