"use client";
import { Download, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NuevoDocumento from "./nuevo-documento";

export default function BotonesCabecera() {
	const [descargar, setDescargar] = useState<boolean>(false);
	const [url, setUrl] = useState<string>("");

	const pathname = usePathname();

	useEffect(() => {
		if (!pathname.endsWith("documentos")) {
			setDescargar(true);
			setUrl(pathname.split("/").pop()!);
		}
	}, [pathname]);

	return (
		<div className="flex gap-2 pb-2">
			{descargar && (
				<Link
					className="flex items-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
					popoverTarget="nuevo-documento"
					href={"https://utfs.io/f/"+url}
				>
					<Download className="size-5" />
					Descargar
				</Link>
			)}
			<button
				className="flex items-center gap-2 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-neutral-400"
				popoverTarget="nuevo-documento"
			>
				<Plus className="size-5" />
				Añadir Documento
			</button>
			<NuevoDocumento />
		</div>
	);
}
