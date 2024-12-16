"use client";
import { updateDescripcionTarea } from "@/lib/tareas/actions";
import { PencilLine } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

export default function DescripcionTarea({
	descripcion,
	idTarea,
}: {
	descripcion: string | null;
	idTarea: string;
}) {
	const [editar, setEditar] = useState(false);
	const [contenidoDescripcion, setContenidoDescripcion] = useState<string | null>(
		descripcion ?? null,
	);

	function handleEditar() {
		if (editar) {
			try {
				updateDescripcionTarea(idTarea, contenidoDescripcion ?? "");
			} catch (error) {
				console.log(error);
			}
		}
		setEditar(!editar);
	}

	return (
		<div className="mt-16 w-full">
			<div className="flex items-center justify-between">
				<span className="text-lg font-semibold">Descripción</span>
				{descripcion && (
					<button
						className="flex items-center gap-2 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-neutral-400  transition hover:border-indigo-500 hover:bg-indigo-600 hover:text-neutral-100"
						onClick={handleEditar}
					>
						<PencilLine className="size-5" />
						{editar ? "Guardar Descripción" : "Editar Descripción"}
					</button>
				)}
			</div>
			{!editar ? (
				<div className="prose mt-4 h-[calc(100vh-425px)] max-w-full overflow-y-scroll rounded border border-neutral-700 bg-neutral-800 p-8 dark:prose-invert">
					<Markdown>{contenidoDescripcion}</Markdown>
				</div>
			) : (
				<form className="max-w-full">
					<textarea
						className="mt-4 h-[calc(100vh-425px)] w-full overflow-y-scroll rounded border border-neutral-700 bg-neutral-800 p-8"
						value={contenidoDescripcion ?? ""}
						onChange={e => setContenidoDescripcion(e.target.value)}
					></textarea>
				</form>
			)}
		</div>
	);
}
