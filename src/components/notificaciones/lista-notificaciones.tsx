"use client";

import { deleteAllNotificaciones, deleteNotificacion } from "@/lib/notificaciones/actions";
import { Notificacion } from "@/lib/notificaciones/types";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ListaNotificaciones({
	notificaciones: todasNotificaciones,
}: {
	notificaciones: Notificacion[];
}) {
	const estados: { [key: string]: string } = {
		Abierto: "bg-zinc-600",
		Progreso: "bg-sky-600",
		Revision: "bg-indigo-600",
		Completado: "bg-green-600",
	};

	const [notificaciones, setNotificaciones] = useState(todasNotificaciones);

	function handleEliminarNotificacion(notificacionId: string) {
		try {
			deleteNotificacion(notificacionId);
		} catch (error) {
			console.log(error);
		} finally {
			setNotificaciones(
				notificaciones.filter(notificacion => notificacion.id !== notificacionId),
			);
		}
	}

	function handleEliminarTodasNotificaciones() {
		try {
			deleteAllNotificaciones();
		} catch (error) {
			console.log(error);
		} finally {
			setNotificaciones([]);
		}
	}

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Últimas notificaciones</h1>
				{notificaciones && notificaciones.length > 0 && (
					<button
						onClick={handleEliminarTodasNotificaciones}
						className="sm:text-md flex items-center gap-2 rounded border border-indigo-500 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
					>
						<Trash2 className="hidden size-4 sm:block" /> Eliminar Notificaciones
					</button>
				)}
			</div>
			<div className="mt-8 flex flex-col gap-2">
				{notificaciones && notificaciones.length > 0 ? (
					notificaciones.map(notificacion => (
						<div
							key={notificacion.id}
							className="group flex cursor-pointer flex-col sm:items-center justify-between gap-4 rounded border border-neutral-700 bg-neutral-900 p-4 transition hover:bg-neutral-800 sm:h-14 sm:flex-row"
						>
							<Link
								href={
									"/" +
									notificacion.tarea?.entorno?.entorno?.equipo?.slug +
									"/" +
									notificacion.tarea?.entorno?.entorno?.slug +
									"/" +
									notificacion.tarea?.entorno?.slug +
									"/" +
									notificacion.tarea?.slug
								}
								className="flex gap-4 flex-col sm:flex-row"
							>
								<div className="flex gap-2 items-center">
									<div
										className={
											"flex size-5 items-center rounded-full " +
											estados[notificacion.tarea?.estado]
										}
									>
										<div
											className={
												"m-auto size-4 rounded-full border-2 border-neutral-900 " +
												estados[notificacion.tarea?.estado]
											}
										/>
									</div>
									<span className="font-semibold">
										{notificacion.tarea?.titulo}
									</span>
								</div>
								<span>{notificacion.notificacion}</span>
							</Link>
							<div className="hidden sm:flex w-64 justify-end text-right">
								<span className="p-2 text-sm group-hover:hidden">
									{new Date(notificacion.created_at).toLocaleString()}
								</span>
								<button
									onClick={() => handleEliminarNotificacion(notificacion.id)}
									className="z-50 hidden items-center gap-2 rounded border border-indigo-500 bg-indigo-600 px-2 py-1 text-neutral-100 group-hover:flex"
								>
									<Trash2 className="size-4" /> Eliminar
								</button>
							</div>
						</div>
					))
				) : (
					<span className="text-center italic text-neutral-400">
						No hay notificaciones.
					</span>
				)}
			</div>
		</>
	);
}
