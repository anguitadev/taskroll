import BotonesCabecera from "@/components/documentos/botones-cabecera";
import ListaDocumentos from "@/components/documentos/lista-documentos";
import { getDocumentosByEntornoSlug } from "@/lib/data";
import Link from "next/link";

export default async function DocumentosLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ equipo: string; entorno: string }>;
}) {
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	const documentosEntorno = await getDocumentosByEntornoSlug(entornoSlug);

	return (
		<>
			<div className="my-6 flex w-full items-center justify-between border-b border-neutral-700">
				<div>
					<Link
						href={`/${equipoSlug}/${entornoSlug}`}
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:bg-neutral-800 hover:border-b-2"
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
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:bg-neutral-800 hover:border-b-2"
					>
						Pizarra
					</Link>
				</div>

				<BotonesCabecera />
			</div>
			<div className="flex gap-4">
				{documentosEntorno && documentosEntorno.length > 0 && (
					<ListaDocumentos
						documentosEntorno={documentosEntorno}
						equipoSlug={equipoSlug}
						entornoSlug={entornoSlug}
					/>
				)}

				{documentosEntorno && documentosEntorno.length > 0 ? children : <span className="m-auto text-neutral-400 italic">No hay documentos en el entorno.</span>}
			</div>
		</>
	);
}
