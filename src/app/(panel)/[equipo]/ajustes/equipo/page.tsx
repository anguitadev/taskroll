import AjustesDelEquipo from "@/components/ajustes/equipo";
import { Tables } from "@/db.types";
import { createClient } from "@/utils/supabase/server";

type Params = Promise<{ equipo: string }>;

export default async function AjustesEquipo(props: { params: Params }) {
	const supabase = await createClient();

	const params = await props.params;
	const equipoSlug = params.equipo;

	const { data: equipo } = await supabase
		.from("Equipos")
		.select("id, nombre, slug, color")
		.eq("slug", equipoSlug)
		.single();

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Ajustes del Equipo</span>
			</div>
			<div className="w-full p-2 md:mx-auto md:w-[640px] overflow-y-scroll  max-h-[calc(100vh-70px)]">
				<div className="mt-8 md:mt-12 flex flex-col p-6">
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
