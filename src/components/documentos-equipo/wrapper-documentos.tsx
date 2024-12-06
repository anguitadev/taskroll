"use client";
import { getUsuario } from "@/lib/data-client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import TablaDocumentos from "./tabla-documentos";

export default function WrapperDocumentos({
	documentosEquipo,
}: {
	documentosEquipo:
		| {
				created_at: string;
				destinatario: string | null;
				entorno: {
					slug: string;
					nombre: string;
					entorno: {
						slug: string;
						nombre: string;
						entorno: {
							slug: string;
							nombre: string;
						};
					} | null;
				} | null;
				id: string;
				nombre: string;
				propietario: string;
				url: string;
		  }[]
		| null
		| undefined;
}) {
	const [tab, setTab] = useState<"todos" | "mios" | "nominas">("todos");
	const [documentos, setDocumentos] = useState(documentosEquipo);

	useEffect(() => {
		const efecto = async () => {
			if (tab === "todos") setDocumentos(documentosEquipo);
			if (tab === "mios") {
				const usuario = await getUsuario();
				if (usuario) {
					setDocumentos(
						documentosEquipo?.filter(documento => documento.propietario === usuario.id),
					);
				}
			}
			if (tab === "nominas") {
				setDocumentos(documentosEquipo?.filter(documento => documento.entorno === null));
			}
		};
		efecto();
	}, [tab]);

	return (
		<>
			<div className="w-fulljustify-between my-6 flex border-b border-neutral-700">
				<span
					className={clsx(
						"cursor-pointer rounded-t px-4 py-2 transition hover:border-b-2 hover:bg-neutral-800",
						tab === "todos"
							? "border-b-2 border-indigo-600 bg-neutral-800 text-neutral-100"
							: "text-neutral-400",
					)}
					onClick={() => setTab("todos")}
				>
					Todos
				</span>
				<span
					className={clsx(
						"cursor-pointer rounded-t px-4 py-2 transition hover:border-b-2 hover:bg-neutral-800",
						tab === "mios"
							? "border-b-2 border-indigo-600 bg-neutral-800 text-neutral-100"
							: "text-neutral-400",
					)}
					onClick={() => setTab("mios")}
				>
					Mis Documentos
				</span>
				<span
					className={clsx(
						"cursor-pointer rounded-t px-4 py-2 transition hover:border-b-2 hover:bg-neutral-800",
						tab === "nominas"
							? "border-b-2 border-indigo-600 bg-neutral-800 text-neutral-100"
							: "text-neutral-400",
					)}
					onClick={() => setTab("nominas")}
				>
					Nóminas
				</span>
			</div>
			<div className="flex gap-4">
				{documentos && documentos.length > 0 ? (
					<TablaDocumentos documentosEquipo={documentos} />
				) : (
					<span className="m-auto italic text-neutral-400">
						No hay documentos en el entorno.
					</span>
				)}
			</div>
		</>
	);
}
