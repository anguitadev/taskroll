import { getEntornoBySlugAndEquipo, isEntornoAdmin } from "@/lib/entornos/data";
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
	params: Promise<{ equipo: string; entorno: string }>;
}) {
	const entornoSlug = (await params).entorno;
	const equipoSlug = (await params).equipo;

	metadata.title = "Taskroll | " + entornoSlug;

	// Fetch entorno del equipo
	const entorno = await getEntornoBySlugAndEquipo(entornoSlug, equipoSlug);
	if (!entorno) return notFound();

	// Comprobar que el usuario es admin del entorno
	const isAdmin = await isEntornoAdmin(entorno.id);
	return (
		<>
			<div className="relative flex justify-center border-b border-neutral-800 p-3 text-center">
				<span>{entorno.nombre}</span>
				{isAdmin && (
					<Link
						href={`/${equipoSlug}/ajustes/${entorno.slug}`}
						className="absolute right-2 top-2 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm font-medium text-neutral-400"
					>
						<Settings className="size-4" />
						Ajustes
					</Link>
				)}
			</div>
			<div className="flex h-[calc(100vh-70px)] flex-col overflow-y-scroll p-3 md:pb-8 md:pt-16 xl:px-16">
				<h1 className="text-3xl font-bold">{entorno.nombre}</h1>
				{entorno.descripcion && (
					<p className="mt-2 text-neutral-400">{entorno.descripcion}</p>
				)}
				{children}
			</div>
		</>
	);
}
