"use client";
import TablaDocumentos from "@/components/documentos-equipo/tabla-documentos";
import { getUsuario } from "@/lib/auth/data-client";
import { createDocumento } from "@/lib/documentos/actions";
import { getNominasByUsuarioId } from "@/lib/documentos/data-client";
import { UploadDropzone } from "@/utils/uploadthing";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import TablaMarcajes from "./tabla-marcajes";

type Nominas =
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

export default function Perfil({
	usuario,
}: {
	usuario: {
		color: string;
		email: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	};
}) {
	const [initial, setInitial] = useState(true);
	const [showNominas, setShowNominas] = useState(false);
	const [showMarcajes, setShowMarcajes] = useState(false);
	const [nominas, setNominas] = useState<Nominas>([]);
	const [nuevaNomina, setNuevaNomina] = useState(false);
	const [nombreDocumento, setNombreDocumento] = useState("");
	const [clientError, setClientError] = useState<string | null>(null);
	const [usuarioLoggeado, setUsuarioLoggeado] = useState<{
		color: string;
		email: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	} | null>(null);

	useEffect(() => {
		if (initial) {
			setInitial(false);
			return;
		}
		if (showNominas) {
			const fetchNominas = async () => {
				const data = await getNominasByUsuarioId(usuario.id);
				setNominas(data || []);
			};
			fetchNominas();
		}
	}, [showNominas]);

	async function handleNuevoDocumento(fileKey: string) {
		const error = await createDocumento(fileKey, nombreDocumento, "nomina", usuario.id);
		if (error) setClientError("Ha habido un error al cargar el documento.");
		window.location.reload();
	}

	async function fetchLoggedUser() {
		const user = await getUsuario();
		if (!user) return;
		setUsuarioLoggeado(user);
	}

	useEffect(() => {
		if (!initial) {
			fetchLoggedUser();
		}
	}, [initial]);

	return (
		<div
			id={"perfil-" + usuario.nombre_usuario}
			popover="auto"
			className="max-h-[700px] w-[750px] flex-col rounded border border-neutral-800 bg-neutral-950 p-6 backdrop:brightness-50 backdrop:backdrop-blur-sm"
		>
			<div className="flex items-center gap-4 border-b border-neutral-800 pb-4 text-2xl font-semibold">
				<div
					className={
						"flex size-12 items-center justify-center rounded text-2xl font-bold " +
						usuario.color
					}
				>
					{usuario.nombre_completo[0]}
				</div>
				{usuario.nombre_completo}
			</div>
			{!showNominas && !showMarcajes && (
				<div className="grid grid-cols-2 grid-rows-2 gap-2 border-b border-neutral-800 py-4">
					<div>
						<span className="font-semibold text-neutral-400">Nombre:</span>{" "}
						{usuario.nombre_completo}
					</div>
					<div>
						<span className="font-semibold text-neutral-400">Nombre de usuario:</span>{" "}
						{usuario.nombre_usuario}
					</div>
					<div>
						<span className="font-semibold text-neutral-400">Puesto:</span>{" "}
						{usuario.puesto}
					</div>
					<div>
						<span className="font-semibold text-neutral-400">Email:</span>{" "}
						<a href={"mailto:" + usuario.email}>{usuario.email}</a>
					</div>
				</div>
			)}
			{showNominas && (
				<>
					{nominas && nominas.length > 0 ? (
						<TablaDocumentos documentosEquipo={nominas} />
					) : (
						<div>
							<div className="mt-4 flex justify-between">
								<span className="italic text-neutral-400">No hay Nóminas...</span>
							</div>
							{clientError && (
								<span className="mt-4 block text-red-500">{clientError}</span>
							)}
						</div>
					)}
					<button
						className="flex w-full justify-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1"
						onClick={() => setNuevaNomina(!nuevaNomina)}
					>
						{!nuevaNomina ? (
							<>
								<Plus />
								Añadir Nómina
							</>
						) : (
							"Cancelar"
						)}
					</button>
					{nuevaNomina && (
						<UploadDropzone
							className="mt-4 border-4 border-dashed border-neutral-800 bg-neutral-900 ut-button:w-fit ut-button:cursor-pointer ut-button:bg-indigo-600 ut-button:px-3 ut-allowed-content:text-neutral-300 ut-label:text-neutral-300"
							endpoint="documentUploader"
							onClientUploadComplete={res => {
								handleNuevoDocumento(res[0].key);
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
					)}
				</>
			)}

			{showMarcajes && (
				<TablaMarcajes usuarioId={usuario.id} nombreUsuario={usuario.nombre_usuario} />
			)}
			{usuarioLoggeado?.id !== usuario.id && (
				<div className="mt-4 flex gap-2">
					{!showMarcajes ? (
						<button
							className="flex-1 rounded border border-indigo-700 bg-indigo-600 py-2"
							onClick={() => {
								setShowMarcajes(true);
								setShowNominas(false);
							}}
						>
							Ver Marcajes
						</button>
					) : (
						<button
							className="flex-1 rounded border border-indigo-700 bg-indigo-600 py-2"
							onClick={() => setShowMarcajes(false)}
						>
							Atrás
						</button>
					)}
					{!showNominas ? (
						<button
							className="flex-1 rounded border border-indigo-700 bg-indigo-600 py-2"
							onClick={() => {
								setShowNominas(true);
								setShowMarcajes(false);
							}}
						>
							Ver Nóminas
						</button>
					) : (
						<button
							className="flex-1 rounded border border-indigo-700 bg-indigo-600 py-2"
							onClick={() => setShowNominas(false)}
						>
							Atrás
						</button>
					)}
				</div>
			)}
		</div>
	);
}
