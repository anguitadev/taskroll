import { getEntornoBySlug } from "@/lib/data";
import { Ellipsis, FlagTriangleRight, Settings, Settings2 } from "lucide-react";
import { notFound } from "next/navigation";

type Params = Promise<{ entorno: string }>;

export default async function Entorno(props: { params: Params }) {
	const params = await props.params;
	const entornoSlug = params.entorno;

	const entorno = await getEntornoBySlug(entornoSlug);

	if (!entorno) return notFound();

	const estados = {
		abierto: "bg-zinc-600",
		progreso: "bg-blue-600",
		revision: "bg-indigo-600",
		completado: "bg-green-600",
	};

	const prioridad = {
		none: "stroke-neutral-400 fill-neutral-900",
		baja: "stroke-neutral-400 fill-neutral-400",
		normal: "stroke-blue-400 fill-blue-400",
		alta: "stroke-orange-400 fill-orange-400",
		urgente: "stroke-red-400 fill-red-400",
	};

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center flex justify-center relative">
				<span>{entorno.nombre}</span>
				<button className="absolute right-2 top-2 flex gap-1 items-center rounded px-2 py-1 font-medium text-neutral-400 text-sm border border-neutral-700 bg-neutral-800"><Settings className="size-4" />Ajustes</button>
			</div>
			<div className="flex flex-col p-8 overflow-y-scroll  max-h-[calc(100vh-70px)]">
				<h1 className="text-3xl font-bold">{entorno.nombre}</h1>
				{entorno.descripcion && (
					<p className="mt-2 text-neutral-400">{entorno.descripcion}</p>
				)}
				<div className="my-4 rounded border border-neutral-700 p-4">
					<h2 className="text-2xl font-semibold">Proyecto 1</h2>
					<table className="mt-4 w-full min-w-[570px] border-separate border-spacing-y-2 p-2">
						<tbody>
							<tr className="text-center text-sm font-light text-neutral-400">
								<th className="border-b border-neutral-700 pb-2 text-left">
									Nombre
								</th>
								<th className="w-44 border-b border-neutral-700 pb-2">Usuarios</th>
								<th className="w-44 border-b border-neutral-700 pb-2">
									Fecha final
								</th>
								<th className="w-44 border-b border-neutral-700 pb-2">Prioridad</th>
								<th className="w-12 border-b border-neutral-700 pb-2">
									<Settings2 className="m-auto size-5" />
								</th>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.abierto
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.abierto
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.none}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.abierto
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.abierto
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.baja}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.progreso
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.progreso
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.baja}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.abierto
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.abierto
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.normal}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.progreso
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.progreso
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.alta}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.revision
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.revision
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.alta}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.revision
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.revision
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.normal}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.completado
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.completado
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.urgente}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="my-4 rounded border border-neutral-700 p-4">
					<h2 className="text-2xl font-semibold">Proyecto 2</h2>
					<table className="mt-4 w-full min-w-[570px] border-separate border-spacing-y-2 p-2">
						<tbody>
							<tr className="text-center text-sm font-light text-neutral-400">
								<th className="border-b border-neutral-700 pb-2 text-left">
									Nombre
								</th>
								<th className="w-44 border-b border-neutral-700 pb-2">Usuarios</th>
								<th className="w-44 border-b border-neutral-700 pb-2">
									Fecha final
								</th>
								<th className="w-44 border-b border-neutral-700 pb-2">Prioridad</th>
								<th className="w-12 border-b border-neutral-700 pb-2">
									<Settings2 className="m-auto size-5" />
								</th>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.abierto
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.abierto
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.none}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.abierto
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.abierto
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.baja}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.progreso
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.progreso
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.baja}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.abierto
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.abierto
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.normal}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.progreso
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.progreso
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.alta}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.revision
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.revision
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.alta}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.revision
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.revision
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.normal}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
							<tr className="text-center">
								<td className="border-b border-neutral-700 pb-2 text-left">
									<div className="flex items-center gap-2">
										<div
											className={
												"flex size-5 items-center rounded-full " +
												estados.completado
											}
										>
											<div
												className={
													"m-auto size-4 rounded-full border-2 border-neutral-900 " +
													estados.completado
												}
											/>
										</div>
										<span>Nombre de la tarea 1</span>
									</div>
								</td>
								<td className="flex flex-row justify-center border-b border-neutral-700 pb-2">
									<div className="flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center">
										I
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center">
										E
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center">
										J
									</div>
									<div className="ml-[-7px] flex size-7 text-sm cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center">
										N
									</div>
								</td>
								<td className="border-b border-neutral-700 pb-2 font-mono">
									13/12/24
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<FlagTriangleRight
										className={"m-auto size-5 " + prioridad.urgente}
									/>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									<Ellipsis className="m-auto size-5 stroke-neutral-400" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
