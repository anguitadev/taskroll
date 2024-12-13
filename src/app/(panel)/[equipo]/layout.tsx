import { isUsuarioInEquipo } from "@/lib/equipos/data";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "",
};

export default async function EquipoLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ equipo: string }>;
}) {
	const equipoSlug = (await params).equipo;

	metadata.title = "Taskroll | " + equipoSlug;

	const usuarioEquipo = await isUsuarioInEquipo(equipoSlug);

	if (!usuarioEquipo) return notFound();

	return <>{children}</>;
}
