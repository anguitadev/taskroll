export default async function DocumentosEntorno({
	params,
}: {
	params: Promise<{ equipo: string; entorno: string }>;
}) {
	return (
		<>
			<span className="m-auto text-neutral-400">Selecciona un documento para verlo.</span>
		</>
	);
}
