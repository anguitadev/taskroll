import { getEntornoAndProyectoNamesByTareaSlug } from "@/lib/data";
import { ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{equipo: string, entorno:string, proyecto: string, tarea: string }>;
}) {
	const tareaSlug = (await params).tarea;
	const proyectoSlug = (await params).proyecto;
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	const nombres = await getEntornoAndProyectoNamesByTareaSlug(tareaSlug);

	return (
		<>
			<div className="relative flex justify-start border-b border-neutral-800 p-3 text-center">
				<div className="flex items-center gap-2">
					<Link href={"/"+equipoSlug+"/"+entornoSlug} className="text-sm font-semibold">{nombres?.nombreEntorno}</Link>
					<ChevronRight className="size-4 stroke-neutral-400" />
					<Link href={"/"+equipoSlug+"/"+entornoSlug+"/"+proyectoSlug} className="text-sm font-semibold">{nombres?.nombreProyecto}</Link>
					<ChevronRight className="size-4 stroke-neutral-400" />
					<Link href={"/"+equipoSlug+"/"+entornoSlug+"/"+proyectoSlug+"/"+tareaSlug} className="text-sm font-semibold">{nombres?.nombreTarea}</Link>
				</div>
				<button className="absolute right-2 top-2 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm font-medium text-neutral-400">
					<Settings className="size-4" />
					Ajustes
				</button>
			</div>
			<div className="flex max-h-[calc(100vh-70px)] flex-col">
				{children}
			</div>
		</>
	);
}
