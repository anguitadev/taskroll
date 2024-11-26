import { getProyectoBySlug } from "@/lib/data";
import { Ellipsis, FlagTriangleRight, Settings2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Proyecto({
	params,
}: {
	params: Promise<{ equipo: string; entorno: string; proyecto: string }>;
}) {
	const proyectoSlug = (await params).proyecto;
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	const proyecto = await getProyectoBySlug(proyectoSlug);

	if (!proyecto) return notFound();

	const estados = {
		abierto: "bg-zinc-600",
		progreso: "bg-sky-600",
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
			<div className="my-6 flex w-full border-b border-neutral-700">
				<Link
					href={`/${equipoSlug}/${entornoSlug}/${proyectoSlug}`}
					className="transitionborder-b cursor-pointer rounded-t border-b-2 border-indigo-600 bg-neutral-800 px-4 py-2"
				>
					Tareas
				</Link>
				<Link
					href={`/${equipoSlug}/${entornoSlug}/${proyectoSlug}/documentos`}
					className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
				>
					Documentos
				</Link>
				<Link
					href={`/${equipoSlug}/${entornoSlug}/${proyectoSlug}/pizarra`}
					className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
				>
					Pizarra
				</Link>
			</div>
			<div className="mt-8 p-4">
				<h2 className="text-xl font-semibold">Tareas Abiertas</h2>
				<table className="mt-2 w-full min-w-[570px] border-separate border-spacing-y-2 p-2">
					<tbody>
						<tr className="text-center text-sm font-light text-neutral-400">
							<th className="border-b border-neutral-700 pb-2 text-left">Nombre</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Usuarios</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Fecha final</th>
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
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									I
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center text-sm">
									E
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center text-sm">
									J
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center text-sm">
									N
								</div>
							</td>
							<td className="border-b border-neutral-700 pb-2 font-mono">13/12/24</td>
							<td className="border-b border-neutral-700 pb-2">
								<FlagTriangleRight className={"m-auto size-5 " + prioridad.none} />
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
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									I
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center text-sm">
									E
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center text-sm">
									J
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center text-sm">
									N
								</div>
							</td>
							<td className="border-b border-neutral-700 pb-2 font-mono">13/12/24</td>
							<td className="border-b border-neutral-700 pb-2">
								<FlagTriangleRight className={"m-auto size-5 " + prioridad.alta} />
							</td>
							<td className="border-b border-neutral-700 pb-2">
								<Ellipsis className="m-auto size-5 stroke-neutral-400" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="p-4">
				<h2 className="text-xl font-semibold">Tareas En Progreso</h2>
				<table className="mt-2 w-full min-w-[570px] border-separate border-spacing-y-2 p-2">
					<tbody>
						<tr className="text-center text-sm font-light text-neutral-400">
							<th className="border-b border-neutral-700 pb-2 text-left">Nombre</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Usuarios</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Fecha final</th>
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
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									I
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center text-sm">
									E
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center text-sm">
									J
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center text-sm">
									N
								</div>
							</td>
							<td className="border-b border-neutral-700 pb-2 font-mono">13/12/24</td>
							<td className="border-b border-neutral-700 pb-2">
								<FlagTriangleRight
									className={"m-auto size-5 " + prioridad.urgente}
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
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									I
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center text-sm">
									E
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center text-sm">
									J
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center text-sm">
									N
								</div>
							</td>
							<td className="border-b border-neutral-700 pb-2 font-mono">13/12/24</td>
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
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									I
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center text-sm">
									E
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center text-sm">
									J
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center text-sm">
									N
								</div>
							</td>
							<td className="border-b border-neutral-700 pb-2 font-mono">13/12/24</td>
							<td className="border-b border-neutral-700 pb-2">
								<FlagTriangleRight
									className={"m-auto size-5 " + prioridad.normal}
								/>
							</td>
							<td className="border-b border-neutral-700 pb-2">
								<Ellipsis className="m-auto size-5 stroke-neutral-400" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="p-4">
				<h2 className="text-xl font-semibold">Tareas En Revisión</h2>
				<table className="mt-2 w-full min-w-[570px] border-separate border-spacing-y-2 p-2">
					<tbody>
						<tr className="text-center text-sm font-light text-neutral-400">
							<th className="border-b border-neutral-700 pb-2 text-left">Nombre</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Usuarios</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Fecha final</th>
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
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									I
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center text-sm">
									E
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center text-sm">
									J
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center text-sm">
									N
								</div>
							</td>
							<td className="border-b border-neutral-700 pb-2 font-mono">13/12/24</td>
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
			<div className="p-4">
				<h2 className="text-xl font-semibold">Tareas Completadas</h2>
				<table className="mt-2 w-full min-w-[570px] border-separate border-spacing-y-2 p-2">
					<tbody>
						<tr className="text-center text-sm font-light text-neutral-400">
							<th className="border-b border-neutral-700 pb-2 text-left">Nombre</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Usuarios</th>
							<th className="w-44 border-b border-neutral-700 pb-2">Fecha final</th>
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
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									I
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-red-600 text-center text-sm">
									E
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-orange-600 text-center text-sm">
									J
								</div>
								<div className="ml-[-7px] flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-indigo-600 text-center text-sm">
									N
								</div>
							</td>
							<td className="border-b border-neutral-700 pb-2 font-mono">13/12/24</td>
							<td className="border-b border-neutral-700 pb-2">
								<FlagTriangleRight
									className={"m-auto size-5 " + prioridad.normal}
								/>
							</td>
							<td className="border-b border-neutral-700 pb-2">
								<Ellipsis className="m-auto size-5 stroke-neutral-400" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}
