import WrapperDocumentos from "@/components/documentos-equipo/wrapper-documentos";
import { getDocumentosByEquipoSlug } from "@/lib/documentos/data";

export default async function Documentos({ params }: { params: Promise<{ equipo: string }> }) {
	const equipoSlug = (await params).equipo;

	const documentosEquipo = await getDocumentosByEquipoSlug(equipoSlug);

	return (
		<>
			<div className="relative flex justify-center border-b border-neutral-800 p-3 text-center">
				<span>Documentos</span>
			</div>
			<div className="flex h-[calc(100vh-70px)] flex-col overflow-y-scroll p-8">
				<h1 className="text-3xl font-bold">Documentos</h1>

				<WrapperDocumentos documentosEquipo={documentosEquipo} />
			</div>
		</>
	);
}
