import BusquedaTareas from "@/components/entornos/busqueda-tareas";
import ListaTareas from "@/components/entornos/lista-tareas";
import NuevaTarea from "@/components/tareas/nueva-tarea";
import { getEntornosByEquipoId } from "@/lib/entornos/data";
import { getEquipoById, getEquipoBySlug } from "@/lib/equipos/data";
import { getTareasByEquipoId } from "@/lib/tareas/data";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Taskroll | Todas las tareas",
};

export default async function Tareas({
	params,
	searchParams,
}: {
	params: Promise<{ equipo: string }>;
	searchParams?: Promise<{
		query?: string;
	}>;
}) {
	const search = await searchParams;
	const query = search?.query;

	const slug = (await params).equipo;

	const equipoId = await getEquipoBySlug(slug);
	if (!equipoId) return notFound();

	const equipo = await getEquipoById(equipoId.id);
	if (!equipo) return notFound();

	const tareas = await getTareasByEquipoId(equipoId.id);

	const entornos = await getEntornosByEquipoId(equipoId.id);

	let zeroTareas = true;

	tareas?.forEach(tarea => {
		if (tarea.tarea !== null) {
			zeroTareas = false;
		}
	});

	return (
		<>
			<div className="relative flex justify-center border-b border-neutral-800 p-3 text-center">
				<span>Todas las tareas</span>
			</div>
			<div className="flex h-[calc(100vh-70px)] flex-col overflow-y-scroll p-2 sm:p-8">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Todas las tareas de {equipo.nombre}</h1>
					<div className="hidden items-center gap-4 sm:flex">
						{!zeroTareas && tareas && <BusquedaTareas />}
						{entornos && entornos?.length > 0 && (
							<button
								className="flex items-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
								popoverTarget={"nueva-tarea-equipo-" + slug}
							>
								<Plus className="size-5" />
								Añadir Tarea
							</button>
						)}
					</div>
				</div>

				{!zeroTareas && tareas ? (
					<ListaTareas query={query} tareas={tareas} />
				) : (
					<span className="mt-8 text-center text-sm italic text-neutral-400">
						No hay tareas en este equipo...
					</span>
				)}
			</div>
			<NuevaTarea entorno={"equipo-" + slug} />
		</>
	);
}
