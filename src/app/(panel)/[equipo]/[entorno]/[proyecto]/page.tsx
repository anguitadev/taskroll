import { getProyectoBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

type Params = Promise<{ proyecto: string }>;

export default async function Proyecto(props: { params: Params }) {

    const params = await props.params;
	const proyectoSlug = params.proyecto;

    const entorno = await getProyectoBySlug(proyectoSlug);

    if(!entorno) return notFound();

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Panel de {proyectoSlug}</span>
			</div>
			<div className="flex flex-col items-center p-8">
				<p>Panel del Proyecto</p>
			</div>
		</>
	);
}