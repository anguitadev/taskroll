"use client";
import { deleteDocumentoByUrl } from "@/lib/actions";
import { Download, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NuevoDocumento from "./nuevo-documento";

export default function BotonesCabecera() {
	const [descargar, setDescargar] = useState<boolean>(false);
	const [eliminar, setEliminar] = useState<boolean>(false);
	const [url, setUrl] = useState<string>("");

	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (!pathname.endsWith("documentos")) {
			setDescargar(true);
			setEliminar(true);
			setUrl(pathname.split("/").pop()!);
		} else {
			setDescargar(false);
			setEliminar(false);
		}
	}, [pathname]);

	async function handleDeleteDocumento() {
		try {
			await deleteDocumentoByUrl(url);
		} catch (error) {
			console.log(error);
		} finally {
			const documentosUrl = pathname.split('/').slice(0, -1).join('/');
			router.push(documentosUrl);
		}
	}

	return (
		<div className="flex gap-2 pb-2">
			{descargar && (
				<Link
					className="flex items-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
					popoverTarget="nuevo-documento"
					href={"https://utfs.io/f/" + url}
				>
					<Download className="size-5" />
					Descargar
				</Link>
			)}
			{eliminar && (
				<button
					className="flex items-center gap-2 rounded border border-red-700 bg-red-600 px-2 py-1 text-sm text-neutral-100"
					onClick={handleDeleteDocumento}
				>
					<Trash2 className="size-5" />
					Eliminar
				</button>
			)}
			<button
				className="flex items-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
				popoverTarget="nuevo-documento"
			>
				<Plus className="size-5" />
				Añadir Documento
			</button>
			<NuevoDocumento />
		</div>
	);
}
