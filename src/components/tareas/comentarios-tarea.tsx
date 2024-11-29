"use client";

import { addComentario } from "@/lib/actions";
import { useState } from "react";

type Comentario = {
	comentario: string;
	created_at: string;
	id: string;
	tarea: string;
	usuario: string;
	Usuarios: {
		nombre_completo: string;
		color: string;
	} | null;
};

export default function ComentariosTarea({
	comentarios,
	idTarea,
}: {
	comentarios: Comentario[] | null;
	idTarea: string;
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

	return (
		<>
			<span className="block border-b border-neutral-800 p-3 font-semibold">Comentarios</span>
			<div className="relative h-[calc(100vh-112px)] grow bg-neutral-800">
				<div className="flex h-[calc(100vh-125px)] flex-col-reverse gap-4 overflow-y-scroll p-2 pb-16">
					{comentariosTarea && comentariosTarea?.length > 0 ? (
						comentariosTarea.map(comentario => (
							<div
								key={comentario.id}
								className="flex flex-col gap-6 rounded bg-neutral-900 p-6"
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
									<span className="text-sm text-neutral-400">
										{new Date(comentario.created_at).toLocaleString()}
									</span>
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
						className="w-full rounded p-2"
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
