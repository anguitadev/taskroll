"use client";

import { addComentario, removeComentario } from "@/lib/tareas/actions";
import { Comentario } from "@/lib/tareas/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function ComentariosTarea({
	comentarios,
	idTarea,
	idUsuario,
}: {
	comentarios: Comentario[] | null;
	idTarea: string;
	idUsuario: string | undefined;
}) {
	const [comentariosTarea, setComentariosTarea] = useState<Comentario[] | null>(
		comentarios ?? null,
	);
	const [comentario, setComentario] = useState<string>("");

	async function handleNewComentario() {
		try {
			const data = await addComentario(idTarea, comentario);
			if (Array.isArray(data)) {
				setComentariosTarea([data[0], ...comentariosTarea!]);
			} else {
				console.error("Ha habido un error al añadir el comentario:", data);
			}
			setComentario("");
		} catch (error) {
			console.log(error);
		}
	}

	async function handleEliminarComentario(comentarioId: string) {
		try {
			await removeComentario(comentarioId);
		} catch (error) {
			console.log(error);
		} finally {
			if (comentariosTarea)
				setComentariosTarea(
					comentariosTarea.filter(comentario => comentario.id !== comentarioId),
				);
		}
	}

	return (
		<>
			<span className="block border-b border-neutral-800 p-3 font-semibold">Comentarios</span>
			<div className="relative h-[calc(100vh-112px)] grow bg-neutral-800">
				<div className="flex h-[calc(100vh-125px)] flex-col-reverse gap-4 overflow-y-scroll p-2 pb-16">
					{comentariosTarea && comentariosTarea?.length > 0 ? (
						comentariosTarea.map(comentario => (
							<div
								key={comentario.id}
								className="group flex flex-col gap-6 rounded-lg border border-neutral-700 bg-neutral-900 p-4"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span
											className={
												"flex size-6 items-center justify-center rounded-full text-sm font-semibold " +
												comentario.Usuarios?.color
											}
										>
											{comentario.Usuarios?.nombre_completo[0].toUpperCase()}
										</span>
										<span className="font-semibold">
											{comentario.Usuarios?.nombre_completo}
										</span>
									</div>
									{comentario.usuario == idUsuario ? (
										<div>
											<span className="text-sm text-neutral-400 group-hover:hidden">
												{new Date(comentario.created_at).toLocaleString()}
											</span>
											<button
												className="hidden group-hover:block"
												onClick={() =>
													handleEliminarComentario(comentario.id)
												}
											>
												<Trash2 className="size-4 stroke-red-500" />
											</button>
										</div>
									) : (
										<span className="text-sm text-neutral-400">
											{new Date(comentario.created_at).toLocaleString()}
										</span>
									)}
								</div>
								<span className="text-sm leading-relaxed">
									{comentario.comentario}
								</span>
							</div>
						))
					) : (
						<span className="text-center text-sm text-neutral-400">
							No hay comentarios en la tarea.
						</span>
					)}
				</div>
				<form
					action={handleNewComentario}
					className="absolute bottom-0 left-0 flex w-full gap-2 bg-neutral-800 p-2"
				>
					<input
						type="text"
						className="w-full rounded border border-neutral-700 p-2"
						placeholder="Escribe un comentario..."
						value={comentario}
						onChange={e => setComentario(e.target.value)}
					/>
					<button className="rounded bg-indigo-600 p-2">Enviar</button>
				</form>
			</div>
		</>
	);
}
