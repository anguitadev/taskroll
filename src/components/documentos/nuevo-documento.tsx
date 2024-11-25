"use client";
import { createDocumento } from "@/lib/actions";
import { UploadDropzone } from "@/utils/uploadthing";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NuevoDocumento() {
	const [nombreDocumento, setNombreDocumento] = useState<string>("");
	const [clientError, setClientError] = useState<string | null>(null);
	// const [textoBoton, setTextoBoton] = useState<string>("Crear Proyecto");

	const pathname = usePathname();

	useEffect(() => {
		document.getElementById("nuevo-proyecto")?.hidePopover();
	}, [pathname]);

	function closePopover() {
		document.getElementById("nuevo-proyecto")?.hidePopover();
	}

	async function handleNuevoDocumento(fileKey: string) {
		const error = await createDocumento(fileKey, nombreDocumento, pathname);
		if (error) setClientError("Ha habido un error al cargar el documento.");
	}

	return (
		<>
			<div
				id="nuevo-documento"
				popover="auto"
				className="w-[640px] rounded-lg border border-neutral-800 p-8 backdrop:brightness-50 backdrop:backdrop-blur-sm"
			>
				<span className="text-2xl font-semibold">Añadir Nuevo Documento</span>
				<div className="mt-6 rounded border border-neutral-800 p-4">
					<div className="flex flex-col gap-2">
						<label htmlFor="nombreEquipo" className="font-semibold">
							Nombre del Documento
						</label>
						<input
							id="nombreEquipo"
							className="rounded border border-neutral-800 px-2 py-1"
							type="text"
							value={nombreDocumento || ""}
							onChange={e => setNombreDocumento(e.target.value)}
						/>
					</div>

					<UploadDropzone
						className="border-4 border-dashed border-neutral-800 bg-neutral-900 ut-button:w-fit ut-button:cursor-pointer ut-button:bg-indigo-600 ut-button:px-3 ut-allowed-content:text-neutral-300 ut-label:text-neutral-300"
						endpoint="documentUploader"
						onClientUploadComplete={res => {
							handleNuevoDocumento(res[0].key);
							closePopover();
						}}
						onUploadError={(error: Error) => {
							alert(`ERROR! ${error.message}`);
						}}
						onChange={acceptedFiles => {
							setNombreDocumento(acceptedFiles[0].name);
						}}
						content={{
							button: ({ ready, isUploading, files }) => {
								if (!ready) return "Preparando...";
								if (isUploading) return "Enviando...";
								if (files.length > 0) return "Subir Documento";
								return "Seleccionar Documento";
							},
							allowedContent: ({ ready, isUploading }) => {
								if (!ready) return "Verificando documento...";
								if (isUploading) return "Enviando documento...";
								return "Tipos de documentos permitidos: pdf, docx, xlsx, pptx";
							},
							label: ({ ready, isUploading, files }) => {
								if (!ready) return "Documento Listo para Enviar";
								if (isUploading) return "Enviando...";
								if (files.length > 0) return files[0].name;
								return "Elige un Documento o Arrástralo Aquí";
							},
						}}
					/>
				</div>
				{clientError && <span className="mt-2 block text-red-500">{clientError}</span>}
			</div>
		</>
	);
}
