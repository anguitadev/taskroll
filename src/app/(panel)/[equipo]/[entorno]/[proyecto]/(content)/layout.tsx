import { getProyectoBySlug } from "@/lib/data";
import { Settings } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ equipo: string; entorno: string; proyecto: string }>;
}) {
	const proyectoSlug = (await params).proyecto;

	const proyecto = await getProyectoBySlug(proyectoSlug);

	if (!proyecto) return notFound();
	return (
		<>
			<div className="relative flex justify-center border-b border-neutral-800 p-3 text-center">
				<span>{proyecto.nombre}</span>
				<button className="absolute right-2 top-2 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm font-medium text-neutral-400">
					<Settings className="size-4" />
					Ajustes
				</button>
			</div>
			<div className="flex max-h-[calc(100vh-70px)] flex-col overflow-y-scroll p-8">
				<h1 className="text-3xl font-bold">{proyecto.nombre}</h1>
				{proyecto.descripcion && (
					<p className="mt-2 text-neutral-400">{proyecto.descripcion}</p>
				)}
				{children}
			</div>
		</>
	);
}