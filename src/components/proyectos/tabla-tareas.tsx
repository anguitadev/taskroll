"use client";
import { deleteTarea } from "@/lib/actions";
import { getTareaLinkById, getUsuariosByTarea } from "@/lib/data-client";
import clsx from "clsx";
import { FlagTriangleRight, Settings2, Trash2 } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

type Tarea = {
	usuario: {
		color: string;
		nombre_completo: string;
	} | null;
	tarea: {
		id: string;
		titulo: string;
		slug: string;
		fecha_fin: string;
		estado: string;
		prioridad: string;
		entorno: {
			nombre: string;
			entorno: {
				nombre: string;
			};
		};
	} | null;
};

interface Usuario {
	Usuarios: {
		id: string;
		color: string;
		nombre_completo: string;
	};
}

import { useEffect, useState } from "react";

export default function TablaTareas({
	tareas,
	extraData,
}: {
	tareas: Tarea[];
	extraData?: boolean;
}) {
	const [tareasFiltradas, setTareasFiltradas] = useState<Tarea[]>(tareas);

	const estados: { [key: string]: string } = {
		Abierto: "bg-zinc-600",
		Progreso: "bg-sky-600",
		Revision: "bg-indigo-600",
		Completado: "bg-green-600",
	};

	const prioridad: { [key: string]: string } = {
		Ninguna: "stroke-neutral-400 fill-neutral-900 text-neutral-400",
		Baja: "stroke-neutral-400 fill-neutral-400 text-neutral-400",
		Normal: "stroke-blue-400 fill-blue-400 text-blue-400",
		Alta: "stroke-orange-400 fill-orange-400 text-orange-400",
		Urgente: "stroke-red-400 fill-red-400 text-red-400",
	};

	const [usuariosPorTarea, setUsuariosPorTarea] = useState<{
		[key: string]: Usuario[];
	}>({});

	useEffect(() => {
		async function fetchUsuarios() {
			const usuariosMap: { [key: string]: Usuario[] } = {};
			for (const tarea of tareas) {
				if (tarea.tarea) {
					const usuarios = await getUsuariosByTarea(tarea.tarea.id);
					if (usuarios) {
						usuariosMap[tarea.tarea.id] = usuarios;
					}
				}
			}
			setUsuariosPorTarea(usuariosMap);
		}

		fetchUsuarios();
	}, [tareas]);

	function handleDeleteTarea(idTarea: string) {
		setTareasFiltradas(tareasFiltradas.filter(tarea => tarea.tarea?.id !== idTarea));
		deleteTarea(idTarea);
	}

	useEffect(() => {
		if (tareasFiltradas.length === 0) window.location.reload();
	}, [tareasFiltradas]);

	const router = useRouter();

	async function handleRedirect(tareaId: string, isTarea: boolean) {
		const link = await getTareaLinkById(tareaId);

		if (link && isTarea)
			router.push(
				"/" +
					link?.entorno.entorno.equipo.slug +
					"/" +
					link?.entorno.entorno.slug +
					"/" +
					link?.entorno.slug +
					"/" +
					link?.slug,
			);
		if (link && !isTarea)
			router.push(
				"/" +
					link?.entorno.entorno.equipo.slug +
					"/" +
					link?.entorno.entorno.slug +
					"/" +
					link?.entorno.slug,
			);
	}

	return (
		<table className="mt-2 w-full min-w-[570px] border-separate border-spacing-y-2 p-2">
			<tbody>
				<tr className="text-sm font-light text-neutral-400">
					<th className="border-b border-neutral-700 pb-2 text-left">Nombre</th>
					{extraData && (
						<th className="w-64 border-b border-neutral-700 pb-2 text-left">
							Proyecto
						</th>
					)}
					<th className="w-44 border-b border-neutral-700 pb-2">Usuarios</th>
					<th className="w-44 border-b border-neutral-700 pb-2">Fecha final</th>
					<th className="w-44 border-b border-neutral-700 pb-2">Prioridad</th>
					<th className="w-12 border-b border-neutral-700 pb-2">
						<Settings2 className="m-auto size-5" />
					</th>
				</tr>
				{tareasFiltradas.map(
					tarea =>
						tarea.tarea && (
							<tr className="text-center" key={tarea.tarea.id}>
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div
										onClick={() => handleRedirect(tarea.tarea!.id, true)}
										className="flex cursor-pointer gap-2"
									>
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados[tarea.tarea.estado]
											}
										>
											<div
												title={tarea.tarea.estado}
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados[tarea.tarea.estado]
												}
											/>
										</div>
										<span className="font-semibold">{tarea.tarea.titulo}</span>
									</div>
								</td>
								{extraData && (
									<td
										className="cursor-pointer border-b border-neutral-700 pb-2 text-left text-sm"
										onClick={() => handleRedirect(tarea.tarea!.id, false)}
									>
										{tarea.tarea.entorno.nombre}
									</td>
								)}
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									{usuariosPorTarea[tarea.tarea.id]?.map(usuario => (
										<div
											key={usuario.Usuarios.id}
											title={usuario.Usuarios.nombre_completo}
											className={
												"-ml-2 flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 text-center text-sm " +
												usuario.Usuarios.color
											}
										>
											{usuario.Usuarios.nombre_completo[0].toUpperCase()}
										</div>
									)) || <span>Cargando...</span>}
								</td>
								<td
									className={clsx(
										"border-b border-neutral-700 pb-2 font-mono",
										tarea.tarea.fecha_fin &&
											moment(tarea.tarea?.fecha_fin)
												.startOf("day")
												.isBefore(moment(new Date()).startOf("day")) &&
											"text-red-400",
										moment(tarea.tarea?.fecha_fin)
											.startOf("day")
											.isAfter(moment(new Date()).startOf("day"))
											? "text-green-400"
											: "text-orange-400",
									)}
								>
									{new Date(tarea.tarea.fecha_fin).toLocaleDateString("es-ES") ==
									new Date().toLocaleDateString("es-ES")
										? "Hoy"
										: new Date(tarea.tarea.fecha_fin).toLocaleDateString(
												"es-ES",
											)}
								</td>
								<td
									className="border-b border-neutral-700 pb-2"
									title={tarea.tarea.prioridad}
								>
									<FlagTriangleRight
										className={
											"m-auto size-5 " + prioridad[tarea.tarea.prioridad]
										}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Trash2
										onClick={() => {
											handleDeleteTarea(tarea.tarea!.id);
										}}
										className="m-auto size-5 cursor-pointer stroke-neutral-400 transition hover:stroke-red-500"
									/>
								</td>
							</tr>
						),
				)}
			</tbody>
		</table>
	);
}