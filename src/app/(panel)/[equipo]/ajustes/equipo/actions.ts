"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = await createClient();

export async function updateEquipo({
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

export async function deleteEquipo(idEquipo: string) {
	const { error } = await supabase.from("Equipos").delete().eq("id", idEquipo);

	const { data: usuario } = await supabase.auth.getUser();

	if (error) {
		console.log(error);
		redirect("/ajustes/equipos?error=" + error.code);
	}

	const { data: equipo } = await supabase
		.from("Usuarios_Equipos")
		.select("Equipos(slug)")
		.eq("usuario", usuario.user!.id)
		.limit(1);

	if (!equipo || equipo.length == 0) {
		revalidatePath("/", "layout");
		redirect("/nuevo-equipo");
	} else {
		revalidatePath("/", "layout");
		redirect("/" + equipo[0].Equipos!.slug);
	}
}
