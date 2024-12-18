import EliminarTarea from "@/components/tareas/eliminar-tarea";
import { getEntornoAndProyectoNamesByTareaSlug } from "@/lib/tareas/data";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
	title: "",
};

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ equipo: string; entorno: string; proyecto: string; tarea: string }>;
}) {
	const tareaSlug = (await params).tarea;
	const proyectoSlug = (await params).proyecto;
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	metadata.title = "Taskroll | " + tareaSlug;

	// Fetch nombre del entorno y el proyecto de la tarea
	const nombres = await getEntornoAndProyectoNamesByTareaSlug(tareaSlug);

	return (
		<>
			<div className="flex items-center justify-end border-b border-neutral-800 p-2 sm:justify-between">
				<div className="hidden items-center gap-2 sm:flex">
					<Link
						href={"/" + equipoSlug + "/" + entornoSlug}
						className="text-sm font-semibold"
					>
						{nombres?.nombreEntorno}
					</Link>
					<ChevronRight className="size-4 stroke-neutral-400" />
					<Link
						href={"/" + equipoSlug + "/" + entornoSlug + "/" + proyectoSlug}
						className="text-sm font-semibold"
					>
						{nombres?.nombreProyecto}
					</Link>
					<ChevronRight className="size-4 stroke-neutral-400" />
					<Link
						href={
							"/" +
							equipoSlug +
							"/" +
							entornoSlug +
							"/" +
							proyectoSlug +
							"/" +
							tareaSlug
						}
						className="text-sm font-semibold"
					>
						{nombres?.nombreTarea}
					</Link>
				</div>
				<EliminarTarea slugTarea={tareaSlug} />
			</div>
			<div className="flex max-h-[calc(100vh-70px)] flex-col">{children}</div>
		</>
	);
}
