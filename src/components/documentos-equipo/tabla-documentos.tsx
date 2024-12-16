import { deleteDocumentoByUrl } from "@/lib/documentos/actions";
import { DocumentosEquipo } from "@/lib/documentos/types";
import { CircleDollarSign, CircleX, Download, FileText, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Visualizador from "../documentos/visualizador";

export default function TablaDocumentos({
	documentosEquipo,
}: {
	documentosEquipo: DocumentosEquipo[] | null | undefined;
}) {
	const pathname = usePathname();
	const equipoSlug = pathname.split("/")[1];

	const [documentos, setDocumentos] = useState(documentosEquipo);
	const [documentoSeleccionado, setDocumentoSeleccionado] = useState<string | null>(null);
	const [nominas, setNominas] = useState(false);

	// Mostrar si son nóminas
	useEffect(() => {
		const numeroNominas = documentosEquipo?.filter(documento => documento.entorno === null);
		if (numeroNominas) setNominas(numeroNominas.length == documentosEquipo?.length);
		setDocumentos(documentosEquipo);
	}, [documentosEquipo]);

	// Eliminar documento
	async function handleDeleteDocumento(documentoUrl: string) {
		try {
			await deleteDocumentoByUrl(documentoUrl);
		} catch (error) {
			console.log(error);
		} finally {
			setDocumentos(documentos?.filter(documento => documento.url !== documentoUrl));
		}
	}

	// Ver documento
	function handleVerDocumento(documentoUrl: string) {
		setDocumentoSeleccionado(documentoUrl);
	}

	// Cerrar popup
	function closePopup() {
		setDocumentoSeleccionado(null);
	}

	return (
		<>
			<table className="mt-2 w-full min-w-[570px] table-fixed border-separate border-spacing-y-2 overflow-y-scroll p-2">
				<tbody>
					<tr className="text-left text-sm font-light text-neutral-400">
						<th className="border-b border-neutral-700 pb-2">Nombre</th>
						{!nominas && (
							<th className="w-64 border-b border-neutral-700 pb-2">Entorno</th>
						)}
						{!nominas && (
							<th className="w-64 border-b border-neutral-700 pb-2">Proyecto</th>
						)}
						<th className="w-52 border-b border-neutral-700 pb-2">Fecha</th>
						<th className="w-16 border-b border-neutral-700 pb-2">
							<Settings2 className="m-auto size-5" />
						</th>
					</tr>
					{documentos?.map(documento => (
						<tr key={documento.id}>
							<td
								className="flex cursor-pointer items-center gap-2 border-b border-neutral-700 pb-2"
								onClick={() => handleVerDocumento(documento.url)}
							>
								{documento.entorno ? (
									<FileText className="size-5 stroke-neutral-400" />
								) : (
									<CircleDollarSign className="size-5 stroke-green-400" />
								)}
								<span className="font-semibold">{documento.nombre}</span>
							</td>
							{!nominas && (
								<td className="border-b border-neutral-700 pb-2">
									{documento.entorno && documento.entorno.entorno ? (
										<Link
											href={`/${equipoSlug}/${documento.entorno.entorno.slug}`}
										>
											{documento.entorno.entorno.nombre}
										</Link>
									) : documento.entorno && !documento.entorno.entorno ? (
										<Link href={`/${equipoSlug}/${documento.entorno.slug}`}>
											{documento.entorno.nombre}
										</Link>
									) : (
										""
									)}
								</td>
							)}
							{!nominas && (
								<td className="border-b border-neutral-700 pb-2">
									{documento.entorno && documento.entorno.entorno ? (
										<Link
											href={`/${equipoSlug}/${documento.entorno.entorno.slug}/${documento.entorno.slug}`}
										>
											{documento.entorno.nombre}
										</Link>
									) : (
										""
									)}
								</td>
							)}
							<td className="border-b border-neutral-700 pb-2 font-mono">
								{new Date(documento.created_at).toLocaleDateString()}
							</td>
							<td className="border-b border-neutral-700 pb-2">
								<div className="flex gap-4">
									<Link href={`https://utfs.io/f/${documento.url}`}>
										<Download className="size-5 stroke-neutral-400" />
									</Link>
									<Trash2
										onClick={() => {
											handleDeleteDocumento(documento.url);
										}}
										className="m-auto size-5 cursor-pointer stroke-neutral-400 transition hover:stroke-red-500"
									/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{documentoSeleccionado && (
				<div className="fixed inset-0 flex items-center justify-center">
					<div className="h-screen w-full rounded-lg border border-neutral-800 bg-neutral-900/80 shadow-lg">
						<button className="absolute right-4 top-4" onClick={closePopup}>
							<CircleX className="size-8 stroke-neutral-100 hover:stroke-red-500" />
						</button>
						<div className="m-auto h-screen w-2/3">
							<Visualizador documento={documentoSeleccionado} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
