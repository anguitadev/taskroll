import { GraficoCompletadas } from "@/components/dashboard/grafico-completadas";
import { GraficoUsuarios } from "@/components/dashboard/grafico-usuarios";
import TablaEstadisticas from "@/components/dashboard/tabla-estadisticas";
import { getCompletadoTareaCountInEquipo, getCompletadoTareaSemanaCountInEquipo, getProgresoTareaCountInEquipo, getRevisionTareaCountInEquipo, getTotalTareaCountInEquipo, getUsuariosWithTareaCountByEquipoSlug } from "@/lib/data";
import { CalendarDays, Clock, ListChecks, Star, Users, Zap } from "lucide-react";
import Image from "next/image";
export default async function Equipo({ params }: { params: Promise<{ equipo: string }> }) {
	const equipoSlug = (await params).equipo;

	const totalTareaCount = await getTotalTareaCountInEquipo(equipoSlug);
	const progresoTareaCount = await getProgresoTareaCountInEquipo(equipoSlug);
	const revisionTareaCount = await getRevisionTareaCountInEquipo(equipoSlug);
	const porcentajeRevision = Math.floor((revisionTareaCount / totalTareaCount) * 100);
	const completadoTareaCount = await getCompletadoTareaCountInEquipo(equipoSlug);
	const tareasCompletadasSemana = await getCompletadoTareaSemanaCountInEquipo(equipoSlug);
	const usuariosTareas = await getUsuariosWithTareaCountByEquipoSlug(equipoSlug);

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Panel de Control</span>
			</div>
			<div className="flex h-[calc(100vh-70px)] flex-col justify-between overflow-y-scroll p-8">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-3xl font-bold">Hola de nuevo!</h1>
						<Image src="/dashboard/wave.webp" alt="Wave" width={36} height={36} />
					</div>
					<p className="mt-2 text-neutral-400">
						Los paneles son tu sede personal, portal de clientes y más.
						<br />
						En ellos encontrarás información relevante sobre tus proyectos.
					</p>
				</div>
				<div className="mt-4 grid grid-cols-8 grid-rows-4 gap-4">
					<div className="col-span-2 rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">Tareas Totales</span>
							<Zap className="size-5 stroke-neutral-400" />
						</div>
						<span className="mt-6 block text-3xl font-bold">{totalTareaCount}</span>
						<span className="mt-2 block text-sm text-neutral-400">
							{progresoTareaCount} tareas en progreso
						</span>
					</div>
					<div className="col-span-2 rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">Tareas en Revisión</span>
							<Clock className="size-5 stroke-neutral-400" />
						</div>
						<span className="mt-6 block text-3xl font-bold">{revisionTareaCount}</span>
						<span className="mt-2 block text-sm text-neutral-400">
							{porcentajeRevision > 0 ? porcentajeRevision : 0}% del total
						</span>
					</div>
					<div className="col-span-2 rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">Tareas Completadas</span>
							<ListChecks className="size-5 stroke-neutral-400" />
						</div>
						<span className="mt-6 block text-3xl font-bold">{completadoTareaCount}</span>
						<span className="mt-2 block text-sm text-neutral-400">
							{tareasCompletadasSemana} la última semana
						</span>
					</div>
					<div className="col-span-2 row-span-4 rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">
								Tareas Completadas la Última Semana
							</span>
							<Star className="size-5 stroke-neutral-400" />
						</div>
						<TablaEstadisticas equipoSlug={equipoSlug} />
					</div>
					<div className="col-span-3 row-span-3 flex flex-col justify-between rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">Tareas Asignadas a los Usuarios</span>
							<Users className="size-5 stroke-neutral-400" />
						</div>
						<GraficoUsuarios usuariosTareas={usuariosTareas} />
					</div>
					<div className="col-span-3 row-span-3 flex flex-col justify-between rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">
								Tareas Completadas en los Últimos Meses
							</span>
							<CalendarDays className="size-5 stroke-neutral-400" />
						</div>
						<GraficoCompletadas />
					</div>
				</div>
			</div>
		</>
	);
}
