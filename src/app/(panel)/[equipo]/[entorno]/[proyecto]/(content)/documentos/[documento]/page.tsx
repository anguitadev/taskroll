import Visualizador from "@/components/documentos/visualizador";

export default async function Documento({
	params,
}: {
	params: Promise<{ documento: string }>;
}) {

    const paramsData = await params;

	return (
		<>
			<Visualizador documento={paramsData.documento} />
		</>
	);
}
