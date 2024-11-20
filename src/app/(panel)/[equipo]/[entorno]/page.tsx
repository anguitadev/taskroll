import { getEntornoBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

type Params = Promise<{ entorno: string }>;

export default async function Entorno(props: { params: Params }) {

    const params = await props.params;
	const entornoSlug = params.entorno;

    const entorno = await getEntornoBySlug(entornoSlug);

    if(!entorno) return notFound();

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Panel de {entornoSlug}</span>
			</div>
			<div className="flex flex-col items-center p-8">
				<p>Panel del Entorno</p>
			</div>
		</>
	);
}