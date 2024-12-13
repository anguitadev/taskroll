import { isEntornoAdmin } from "@/lib/entornos/data";
import { getProyectoBySlug } from "@/lib/proyectos/data";
import { Settings } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "",
};

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ equipo: string; entorno: string; proyecto: string }>;
}) {
	const equipoSlug = (await params).equipo;
	const proyectoSlug = (await params).proyecto;

	metadata.title = "Taskroll | " + proyectoSlug;

	const proyecto = await getProyectoBySlug(proyectoSlug);
	if (!proyecto) return notFound();

	const isAdmin = await isEntornoAdmin(proyecto.id);
	return (
		<>
			<div className="relative flex justify-center border-b border-neutral-800 p-3 text-center">
				<span>{proyecto.nombre}</span>
				{isAdmin && <Link href={`/${equipoSlug}/ajustes/${proyecto.slug}`} className="absolute right-2 top-2 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm font-medium text-neutral-400">
					<Settings className="size-4" />
					Ajustes
				</Link>}
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
