"use client";
import { Tarea } from "@/lib/tareas/types";
import moment from "moment";
import { useEffect, useState } from "react";
import TablaTareas from "../proyectos/tabla-tareas";

export default function ListaTareas({
	tareas,
	query,
}: {
	tareas: Tarea[];
	query: string | undefined;
}) {
	const [tareasBuscadas, setTareasBuscadas] = useState<Tarea[]>([]);
	const [tareasVencidas, setTareasVencidas] = useState<Tarea[]>([]);
	const [tareasDeHoy, setTareasDeHoy] = useState<Tarea[]>([]);
	const [tareasDeManana, setTareasDeManana] = useState<Tarea[]>([]);
	const [tareasDeFuturo, setTareasDeFuturo] = useState<Tarea[]>([]);

	const hoy = moment(new Date());
	const manana = moment(new Date().setDate(new Date().getDate() + 1));

	// Se filtran las tareas por fecha
	useEffect(() => {
		const tareasPendientes = tareas?.filter(tarea => {
			return moment(tarea.tarea?.fecha_fin).startOf("day").isBefore(hoy.startOf("day"));
		});

		if (tareasPendientes) setTareasVencidas(tareasPendientes);

		const tareasHoy = tareas?.filter(tarea => {
			return moment(tarea.tarea?.fecha_fin).startOf("day").isSame(hoy.startOf("day"));
		});

		if (tareasHoy) setTareasDeHoy(tareasHoy);

		const tareasManana = tareas?.filter(tarea => {
			return moment(tarea.tarea?.fecha_fin).startOf("day").isSame(manana.startOf("day"));
		});

		if (tareasManana) setTareasDeManana(tareasManana);

		const tareasFuturo = tareas?.filter(tarea => {
			return moment(tarea.tarea?.fecha_fin).startOf("day").isAfter(manana.startOf("day"));
		});

		if (tareasFuturo) setTareasDeFuturo(tareasFuturo);

	}, [tareas]);

	// Se muestran las tareas en base a la búsqueda
	useEffect(() => {
		if (query === undefined) return setTareasBuscadas([]);
		const tareaBuscada = tareas?.filter(tarea => {
			return tarea.tarea?.titulo.toLowerCase().includes(query.toLowerCase());
		});
		setTareasBuscadas(tareaBuscada);
	}, [query]);

	return (
		<>
			{query && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold">Resultados de la búsqueda:</h2>
					{tareasBuscadas.length > 0 ? (
						<TablaTareas tareas={tareasBuscadas} extraData={true} />
					) : (
						<span className="italic text-neutral-400">
							No se ha encontrado la tarea...
						</span>
					)}
				</div>
			)}
			{!query && tareasVencidas && tareasVencidas.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold">Pendientes</h2>
					<TablaTareas tareas={tareasVencidas} extraData={true} />
				</div>
			)}
			{!query && tareasDeHoy && tareasDeHoy.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold">Hoy</h2>
					<TablaTareas tareas={tareasDeHoy} extraData={true} />
				</div>
			)}
			{!query && tareasDeManana && tareasDeManana.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold">Mañana</h2>
					<TablaTareas tareas={tareasDeManana} extraData={true} />
				</div>
			)}
			{!query && tareasDeFuturo && tareasDeFuturo.length > 0 && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold">Futuro</h2>
					<TablaTareas tareas={tareasDeFuturo} extraData={true} />
				</div>
			)}
		</>
	);
}
