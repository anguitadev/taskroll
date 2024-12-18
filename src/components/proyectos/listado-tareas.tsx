"use client";
import { getTareasByProyectoSlug } from "@/lib/tareas/data-client";
import { Tarea } from "@/lib/tareas/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TablaTareas from "./tabla-tareas";

// type Tarea = {
// 	usuario: {
// 		color: string;
// 		nombre_completo: string;
// 	} | null;
// 	tarea: {
// 		id: string;
// 		titulo: string;
// 		slug: string;
// 		fecha_fin: string;
// 		estado: string;
// 		prioridad: string;
// 		entorno: {
// 			nombre: string;
// 			entorno: {
// 				nombre: string;
// 			};
// 		};
// 	} | null;
// };

export default function ListadoTareas({ idProyecto }: { idProyecto: string }) {
	const [tareas, setTareas] = useState<Tarea[]>([]);

	const pathname = usePathname();

	async function loadTareas() {
		try {
			const data = await getTareasByProyectoSlug(idProyecto);
			if (!data) return;

			//Comprobar que el objeto contenido dentro de tareas no sea null
			const tareasFiltradas = data.filter(tarea => tarea.tarea !== null);
			//Ordenar las tareas por fecha
			if (tareasFiltradas) {
				tareasFiltradas.sort((a, b) => {
					if (a.tarea?.fecha_fin && b.tarea?.fecha_fin) {
						const fechaA = new Date(a.tarea?.fecha_fin);
						const fechaB = new Date(b.tarea?.fecha_fin);
						return fechaA.getTime() - fechaB.getTime();
					} else {
						return 0;
					}
				});
				setTareas(tareasFiltradas);
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Cargar las tareas cada vez que cambia el proyecto o la URL
	useEffect(() => {
		loadTareas();
	}, [idProyecto, pathname]);

	let zeroTareas = false;

	tareas.forEach(tarea => {
		if (tarea.tarea === null) {
			zeroTareas = true;
		}
	});

	//Comprobar si hay tareas
	if (!tareas || tareas.length === 0 || zeroTareas === null)
		return <span className="mt-4 text-center italic text-neutral-400">No hay tareas...</span>;

	// Filtrar las tareas por estado
	const tareasAbiertas = tareas.filter(tarea => tarea.tarea?.estado === "Abierto");
	const tareasProgreso = tareas.filter(tarea => tarea.tarea?.estado === "Progreso");
	const tareasRevision = tareas.filter(tarea => tarea.tarea?.estado === "Revision");
	const tareasCompletadas = tareas.filter(tarea => tarea.tarea?.estado === "Completado");

	return (
		<div className="mt-8 sm:p-4">
			{tareasAbiertas.length > 0 && (
				<>
					<h2 className="text-xl font-semibold">Tareas Abiertas</h2>
					<TablaTareas tareas={tareasAbiertas} />
				</>
			)}
			{tareasProgreso.length > 0 && (
				<>
					<h2 className="mt-4 text-xl font-semibold">Tareas En Progreso</h2>
					<TablaTareas tareas={tareasProgreso} />
				</>
			)}
			{tareasRevision.length > 0 && (
				<>
					<h2 className="mt-4 text-xl font-semibold">Tareas En Revisión</h2>
					<TablaTareas tareas={tareasRevision} />
				</>
			)}
			{tareasCompletadas.length > 0 && (
				<>
					<h2 className="mt-4 text-xl font-semibold">Tareas Completadas</h2>
					<TablaTareas tareas={tareasCompletadas} />
				</>
			)}
		</div>
	);
}
