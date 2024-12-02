"use client";

import { deleteAllNotificaciones, removeNotificacion } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Notificacion {
	id: string;
	notificacion: string;
	created_at: string;
	tarea: {
		estado: string;
		titulo: string;
		slug: string;
		entorno: {
			slug: string;
			entorno: {
				slug: string;
				equipo: {
					slug: string;
				};
			};
		};
	};
}

export default function ListaNotificaciones({
	notificaciones: todasNotificaciones,
}: {
	notificaciones: Notificacion[];
}) {
	const [notificaciones, setNotificaciones] = useState(todasNotificaciones);

	const estados: { [key: string]: string } = {
		Abierto: "bg-zinc-600",
		Progreso: "bg-sky-600",
		Revision: "bg-indigo-600",
		Completado: "bg-green-600",
	};

	function handleEliminarNotificacion(notificacionId: string) {
		try {
			removeNotificacion(notificacionId);
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
						className="flex items-center gap-2 rounded border border-indigo-500 bg-indigo-600 px-2 py-1 text-neutral-100"
					>
						<Trash2 className="size-4" /> Eliminar Notificaciones
					</button>
				)}
			</div>
			<div className="mt-8 flex flex-col gap-2">
				{notificaciones && notificaciones.length > 0 ? (
					notificaciones.map(notificacion => (
						<div
							key={notificacion.id}
							className="group flex h-14 cursor-pointer items-center justify-between gap-4 rounded border border-neutral-700 bg-neutral-900 p-4 transition hover:bg-neutral-800"
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
								className="flex items-center gap-4"
							>
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
								<span className="font-semibold">{notificacion.tarea?.titulo}</span>
								<span>{notificacion.notificacion}</span>
							</Link>
							<div className="flex w-64 justify-end text-right">
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
