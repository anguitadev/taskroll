import CanvasPizarra from "@/components/pizarra/canvas-pizarra";
import { getPizarraFromEntorno } from "@/lib/data";
import Link from "next/link";

export default async function Pizarra({
	params,
}: {
	params: Promise<{ equipo: string; entorno: string }>;
}) {
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	const contenido = await getPizarraFromEntorno(entornoSlug);

	return (
		<>
			<div className="h-content my-6 flex w-full items-end justify-between border-b border-neutral-700 py-2">
				<div>
					<Link
						href={`/${equipoSlug}/${entornoSlug}`}
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:bg-neutral-800 hover:border-b-2"
					>
						Tareas
					</Link>
					<Link
						href={`/${equipoSlug}/${entornoSlug}/documentos`}
						className="cursor-pointer rounded-t px-4 py-2 text-neutral-400 transition hover:bg-neutral-800 hover:border-b-2"
					>
						Documentos
					</Link>
					<Link
						href={`/${equipoSlug}/${entornoSlug}/pizarra`}
						className="cursor-pointer rounded-t border-b-2 border-indigo-600 bg-neutral-800 px-4 py-2 transition"
					>
						Pizarra
					</Link>
				</div>
			</div>
			<div className="flex h-full gap-4">
				{contenido && <CanvasPizarra entorno={entornoSlug} contenido={contenido!.contenido!} />}
			</div>
		</>
	);
}
