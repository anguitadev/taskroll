"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ListaDocumentos({
	documentosEntorno,
	equipoSlug,
	entornoSlug,
}: {
	documentosEntorno: {
		created_at: string;
		destinatario: string | null;
		entorno: string | null;
		id: string;
		nombre: string;
		propietario: string;
		url: string;
	}[];
	equipoSlug: string;
	entornoSlug: string;
}) {
	const pathname = usePathname();
	const selected = pathname.split("/").pop();

	return (
		<div className="flex h-[calc(100vh-295px)] max-h-[calc(100vh-295px)] min-w-96 max-w-96 flex-col overflow-y-scroll border-r border-neutral-700 pr-1">
			{documentosEntorno.map(documento => (
				<Link
					href={`${pathname}/${documento.url}`}
					key={documento.id}
					className={clsx(
						"has-tooltip flex max-w-96 cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-l px-4 py-2 transition hover:border-r-2 hover:border-indigo-600 hover:bg-neutral-800",
						selected === documento.url && "border-r-2 border-indigo-600 bg-neutral-800",
					)}
				>
					<span className="tooltip mt-16 rounded bg-neutral-950 px-2 py-1 text-neutral-400 shadow-lg">
						{documento.nombre}
					</span>
					<span className="truncate">{documento.nombre}</span>
				</Link>
			))}
		</div>
	);
}
