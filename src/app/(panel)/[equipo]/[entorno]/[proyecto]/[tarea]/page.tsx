import { getTareaBySlug, getUsuariosByTarea } from "@/lib/data";
import clsx from "clsx";
import { CalendarDays, Check, CirclePower, FlagTriangleRight, Rocket, Users } from "lucide-react";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export default async function Tarea({ params }: { params: Promise<{ tarea: string }> }) {
	const tareaSlug = (await params).tarea;
	const tarea = await getTareaBySlug(tareaSlug);
	if (!tarea) return notFound();

	const usuarios = await getUsuariosByTarea(tarea.id);

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

	return (
		<div className="grid h-[calc(100vh-70px)] grid-cols-4">
			<div className="col-span-3 overflow-y-scroll p-8">
				<h1 className="text-3xl font-bold">{tarea.titulo}</h1>

				<div className="my-16 grid w-2/3 grid-cols-2 grid-rows-2 gap-x-24 gap-y-2">
					<div className="flex justify-between">
						<div className="flex items-center gap-2 text-neutral-400">
							<CirclePower className="size-5" /> <span>Estado</span>
						</div>
						<div className="flex w-2/5 items-center gap-2">
							<span className={"rounded px-2 py-1 " + estados[tarea.estado]}>
								{tarea.estado}
							</span>
							<Check
								className={clsx(
									"size-8 rounded p-2",
									tarea.estado === "Completado"
										? "bg-green-600"
										: "border border-neutral-500",
								)}
							/>
						</div>
					</div>

					<div className="flex justify-between">
						<div className="flex items-center gap-2 text-neutral-400">
							<Users className="size-5" /> <span>Usuarios</span>
						</div>
						<div className="flex w-2/5 items-center">
							{usuarios && usuarios.map(usuario => (
								<div className="flex size-7 cursor-default items-center justify-center rounded-full border-2 border-neutral-900 bg-green-600 text-center text-sm">
									{usuario.Usuarios!.nombre_completo.slice(0, 1).toUpperCase()}
								</div>
							))}
						</div>
					</div>

					<div className="flex justify-between">
						<div className="flex items-center gap-2 text-neutral-400">
							<CalendarDays className="size-5" /> <span>Fecha límite</span>
						</div>
						<div className="flex w-2/5 items-center">
							<span className="font-mono font-semibold text-green-500">
								{new Date(tarea.fecha_fin!).toLocaleDateString("es-ES")}
							</span>
						</div>
					</div>

					<div className="flex justify-between">
						<div className="flex items-center gap-2 text-neutral-400">
							<Rocket className="size-5" /> <span>Prioridad</span>
						</div>
						<div className={"flex w-2/5 items-center gap-1"+prioridad[tarea.prioridad]}>
							<FlagTriangleRight className="size-5" />
							<span className="font-semibold">{tarea.prioridad}</span>
						</div>
					</div>
				</div>
				<div className="mt-16 w-full">
					<span className="text-lg font-semibold">Descripción</span>
					<div className="prose mt-4 h-[calc(100vh-425px)] max-w-full overflow-y-scroll rounded border border-neutral-700 bg-neutral-800 p-8 dark:prose-invert">
						<Markdown>{tarea.descripcion}</Markdown>
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-stretch border-l border-neutral-800">
				<span className="block border-b border-neutral-800 p-3 font-semibold">
					Comentarios
				</span>
				<div className="relative grow bg-neutral-800 p-2">
					<div className="flex h-full flex-col justify-end pb-16">
						<div className="flex flex-col gap-6 rounded bg-neutral-900 p-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className="flex size-6 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold">
										I
									</span>
									<span className="font-semibold">Iván Anguita</span>
								</div>
								<span className="text-sm text-neutral-400">10 Oct a las 10:24</span>
							</div>
							<span className="text-sm leading-relaxed">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
								posuere accumsan odio et laoreet. Ut sit amet velit ligula. Mauris
								cursus bibendum ipsum, et lacinia mauris dictum non. Integer ac mi
								volutpat, egestas augue in, bibendum nulla. Curabitur fermentum quam
								a ante mollis, at viverra nulla iaculis. Vivamus egestas non mi sed
								interdum. Nunc scelerisque quam vitae commodo porttitor. Sed sit
								amet nisl leo.
							</span>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 flex w-full gap-2 p-2">
						<input
							type="text"
							className="w-full rounded p-2"
							placeholder="Escribe un comentario..."
						/>
						<button className="rounded bg-indigo-600 p-2">Enviar</button>
					</div>
				</div>
			</div>
		</div>
	);
}
