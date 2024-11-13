"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function updateEquipo({
	idEquipo,
	nombreEquipo,
	slugEquipo,
	colorEquipo,
}: {
	idEquipo: string;
	nombreEquipo: string;
	slugEquipo: string;
	colorEquipo: string;
}) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("Equipos")
		.update({
			nombre: nombreEquipo,
			slug: slugEquipo,
			color: colorEquipo,
		})
		.eq("id", idEquipo);

	if (error) {
		console.log(error);
	}

	revalidatePath("/");
	redirect("/" + slugEquipo + "/ajustes/equipo?success=" + "equipo_actualizado");
}
