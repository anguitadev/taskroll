"use client";
import { deleteDocumento } from "@/lib/actions";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ListaDocumentos({
	documentosEntorno,
	equipoSlug,
	entornoSlug,
}: {
	documentosEntorno: { entorno: string; id: string; nombre: string; url: string | null }[];
	equipoSlug: string;
	entornoSlug: string;
}) {
	const pathname = usePathname();
	const selected = pathname.split("/").pop();

	async function handleDelete() {
		const error = await deleteDocumento(pathname);
		if (error) console.log(error);
	}

	return (
		<div className="flex h-[calc(100vh-295px)] max-h-[calc(100vh-295px)] min-w-64 max-w-64 flex-col overflow-y-scroll border-r border-neutral-700 pr-1">
			{documentosEntorno.map(documento => (
				<Link
					href={`/${equipoSlug}/${entornoSlug}/documentos/${documento.url}`}
					key={documento.id}
					className={clsx(
						"has-tooltip flex max-w-60 cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-l px-4 py-2 transition hover:border-r-2 hover:border-indigo-600 hover:bg-neutral-800",
						selected === documento.url && "border-r-2 border-indigo-600 bg-neutral-800",
					)}
				>
					<span className="tooltip mt-16 rounded bg-neutral-950 px-2 py-1 text-neutral-400 shadow-lg">
						{documento.nombre}
					</span>
					<span className="truncate">{documento.nombre}</span>
					{selected === documento.url && (
						<Trash2 onClick={handleDelete} className="size-4 stroke-neutral-400" />
					)}
				</Link>
			))}
		</div>
	);
}
