import ListaNotificaciones from "@/components/notificaciones/lista-notificaciones";
import { getNotificacionesByEquipoSlug } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Notificaciones({ params }: { params: Promise<{ equipo: string }> }) {
	const equipoSlug = (await params).equipo;

	if (!equipoSlug) return notFound();

	const notificaciones = await getNotificacionesByEquipoSlug(equipoSlug);

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Notificaciones</span>
			</div>
			<div className="max-h-[calc(100vh-70px)] overflow-y-scroll p-3 md:pb-8 md:pt-16 xl:px-16">
				<ListaNotificaciones notificaciones={notificaciones!} />
			</div>
		</>
	);
}
