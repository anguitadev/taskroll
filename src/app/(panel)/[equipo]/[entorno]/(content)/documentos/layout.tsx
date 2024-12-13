import BotonesCabecera from "@/components/documentos/botones-cabecera";
import ListaDocumentos from "@/components/documentos/lista-documentos";
import { getDocumentosByEntornoSlug } from "@/lib/documentos/data";
import { Documento } from "@/lib/documentos/types";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "",
};

export default async function DocumentosLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ equipo: string; entorno: string }>;
}) {
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	metadata.title = "Taskroll | " + entornoSlug + " | Documentos";

	// Fetch documentos del entorno
	const documentosEntorno: Documento[] | null = await getDocumentosByEntornoSlug(entornoSlug);

	return (
		<>
			<div className="my-6 flex w-full items-center justify-between border-b border-neutral-700">
				<div>
					<Link
						href={`/${equipoSlug}/${entornoSlug}`}
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
					>
						Tareas
					</Link>
					<Link
						href={`/${equipoSlug}/${entornoSlug}/documentos`}
						className="transitionborder-b cursor-pointer rounded-t border-b-2 border-indigo-600 bg-neutral-800 px-4 py-2"
					>
						Documentos
					</Link>
					<Link
						href={`/${equipoSlug}/${entornoSlug}/pizarra`}
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:border-b-2 hover:bg-neutral-800"
					>
						Pizarra
					</Link>
				</div>

				<BotonesCabecera />
			</div>
			<div className="flex gap-4">
				{documentosEntorno && documentosEntorno.length > 0 && (
					<ListaDocumentos documentosEntorno={documentosEntorno} />
				)}

				{documentosEntorno && documentosEntorno.length > 0 ? (
					children
				) : (
					<span className="m-auto italic text-neutral-400">
						No hay documentos en el entorno.
					</span>
				)}
			</div>
		</>
	);
}
