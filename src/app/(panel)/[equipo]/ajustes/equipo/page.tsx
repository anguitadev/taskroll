import AjustesDelEquipo from "@/components/ajustes/equipo";
import { Tables } from "@/db.types";
import { getEquipoById, getEquipoBySlug, isUsuarioEquipoAdmin } from "@/lib/equipos/data";
import { notFound } from "next/navigation";

type Params = Promise<{ equipo: string }>;

export default async function AjustesEquipo(props: { params: Params }) {
	const params = await props.params;
	const equipoSlug = params.equipo;
	
	const isAdmin = await isUsuarioEquipoAdmin(equipoSlug);
	if (!isAdmin) return notFound();

	const equipoId = await getEquipoBySlug(equipoSlug);
	if (!equipoId) return notFound();
	const equipo = await getEquipoById(equipoId.id);

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Ajustes del Equipo</span>
			</div>
			<div className="max-h-[calc(100vh-70px)] w-full overflow-y-scroll p-2 md:mx-auto md:w-[640px]">
				<div className="mt-8 flex flex-col p-6 md:mt-12">
					<h1 className="text-3xl font-semibold">Equipo</h1>
					<span className="text-sm text-neutral-400">
						Aquí puedes realizar cambios sobre el equipo.
					</span>
				</div>
				<AjustesDelEquipo {...(equipo as Tables<"Equipos">)} />
			</div>
		</>
	);
}
