"use client";

import { updatePizarra } from "@/lib/pizarras/actions";
import { PencilLine } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CanvasPizarra({
	contenido,
	entorno,
}: {
	contenido: string;
	entorno: string;
}) {
	const [editar, setEditar] = useState(false);
	const [contenidoPizarra, setContenidoPizarra] = useState<string>(contenido);

	// Editar pizarra
	function handleEditar() {
		if (editar) {
			try {
				updatePizarra(entorno, contenidoPizarra);
			} catch (error) {
				console.log(error);
			}
		}
		setEditar(!editar);
	}

	return (
		<div className="relative h-[calc(100vh-295px)] grow overflow-y-scroll rounded-lg border border-neutral-700 bg-neutral-950 md:p-4">
			<button
				className="absolute right-1 top-2 flex items-center gap-2 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-neutral-400"
				onClick={handleEditar}
			>
				<PencilLine className="size-5" />
				{editar ? "Guardar Pizarra" : "Editar Pizarra"}
			</button>
			{!editar ? (
				<div className="prose mx-auto min-h-full md:min-w-[1000px] bg-neutral-800 p-2 md:p-8 dark:prose-invert">
					<Markdown remarkPlugins={[remarkGfm]}>{contenidoPizarra}</Markdown>
				</div>
			) : (
				<form className="mx-auto min-h-full w-[1000px]">
					<textarea
						className="h-[calc(100vh-336px)] w-full bg-neutral-800 p-8"
						value={contenidoPizarra}
						onChange={e => setContenidoPizarra(e.target.value)}
					></textarea>
				</form>
			)}
		</div>
	);
}
