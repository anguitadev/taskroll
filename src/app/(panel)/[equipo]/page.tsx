import { GraficoCompletadas } from "@/components/dashboard/grafico-completadas";
import { GraficoUsuarios } from "@/components/dashboard/grafico-usuarios";
import TablaEstadisticas from "@/components/dashboard/tabla-estadisticas";
import { getUsuariosWithTareaCountByEquipoSlug, isUsuarioEquipoAdmin } from "@/lib/equipos/data";
import {
	getCompletadoTareaCountInEquipo,
	getCompletadoTareaSemanaCountInEquipo,
	getProgresoTareaCountInEquipo,
	getRevisionTareaCountInEquipo,
	getTotalTareaCountInEquipo,
	getTotalTareasInEquipo,
} from "@/lib/tareas/data";
import { CalendarDays, Clock, ListChecks, Settings, Star, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default async function Equipo({ params }: { params: Promise<{ equipo: string }> }) {
	const equipoSlug = (await params).equipo;

	const totalTareaCount = await getTotalTareaCountInEquipo(equipoSlug);
	const progresoTareaCount = await getProgresoTareaCountInEquipo(equipoSlug);
	const revisionTareaCount = await getRevisionTareaCountInEquipo(equipoSlug);
	const porcentajeRevision = Math.floor((revisionTareaCount / totalTareaCount) * 100);
	const completadoTareaCount = await getCompletadoTareaCountInEquipo(equipoSlug);
	const tareasCompletadasSemana = await getCompletadoTareaSemanaCountInEquipo(equipoSlug);
	const usuariosTareas = await getUsuariosWithTareaCountByEquipoSlug(equipoSlug);
	const totalTareas = await getTotalTareasInEquipo(equipoSlug);

	const tareasMes: Record<string, { completadas: number; totales: number }> = {};

	// Calcular tareas completadas por mes
	if (totalTareas)
		totalTareas.forEach(({ tarea }) => {
			const month = new Date(tarea.fecha_fin).toLocaleString("es-ES", { month: "long" });
			if (!tareasMes[month]) {
				tareasMes[month] = { completadas: 0, totales: 0 };
			}

			tareasMes[month].totales += 1;
			if (tarea.estado === "Completado") {
				tareasMes[month].completadas += 1;
			}
		});

	const chartData = Object.entries(tareasMes).map(([mes, { completadas, totales }]) => ({
		mes,
		completadas,
		totales,
	}));

	// Comprobar si es admin
	const isAdmin = await isUsuarioEquipoAdmin(equipoSlug);

	return (
		<>
			<div className="relative flex justify-center border-b border-neutral-800 p-3 text-center">
				<span>Panel de Control</span>
				{isAdmin && (
					<Link
						href={`/${equipoSlug}/ajustes/equipo`}
						className="absolute right-2 top-2 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm font-medium text-neutral-400"
					>
						<Settings className="size-4" />
						Ajustes
					</Link>
				)}
			</div>
			<div className="flex h-[calc(100vh-70px)] flex-col justify-between overflow-y-scroll p-3 md:pb-8 md:pt-16 xl:px-16">
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
				<div className="mt-4 flex flex-col md:grid md:grid-cols-8 md:grid-rows-3 gap-4">
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
						<span className="mt-6 block text-3xl font-bold">
							{completadoTareaCount}
						</span>
						<span className="mt-2 block text-sm text-neutral-400">
							{tareasCompletadasSemana} la última semana
						</span>
					</div>
					<div className="col-span-2 row-span-3 rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">
								Tareas Completadas la Última Semana
							</span>
							<Star className="size-5 stroke-neutral-400" />
						</div>
						<TablaEstadisticas equipoSlug={equipoSlug} />
					</div>
					<div className="col-span-3 row-span-2 flex flex-col justify-between rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">Tareas Asignadas a los Usuarios</span>
							<Users className="size-5 stroke-neutral-400" />
						</div>
						{usuariosTareas.length > 0 ? (
							<GraficoUsuarios usuariosTareas={usuariosTareas} />
						) : (
							<span className="mt-8 text-sm italic text-neutral-400">
								No hay suficiente información para mostrar...
							</span>
						)}
					</div>
					<div className="col-span-3 row-span-2 flex flex-col justify-between rounded border border-neutral-700 bg-neutral-800 p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold">
								Tareas Completadas en los Últimos Meses
							</span>
							<CalendarDays className="size-5 stroke-neutral-400" />
						</div>
						{usuariosTareas.length > 0 ? (
							<GraficoCompletadas chartData={chartData} />
						) : (
							<span className="mt-8 text-sm italic text-neutral-400">
								No hay suficiente información para mostrar...
							</span>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
