"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function nuevoEquipo(formData: FormData) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	const nombreEquipo = formData.get("nombreEquipo") as string;

	const slug = nombreEquipo.toLowerCase().replace(/ /g, "-");

	const { data: Usuarios_Equipos } = await supabase
		.from("Usuarios_Equipos")
		.select(`Equipos (slug)`)
		.eq("usuario", user.id);

	if (Usuarios_Equipos && Usuarios_Equipos.length > 0) {
		Usuarios_Equipos.forEach(equipo => {
			if (equipo.Equipos && equipo.Equipos.slug === slug) {
				return redirect("/nuevo-equipo?error=" + "equipo_existe");
			}
		});
	}

	const { data: equipo, error: errorEquipo } = await supabase
		.from("Equipos")
		.insert([{ nombre: nombreEquipo, slug: slug }])
		.select("id")
		.limit(1);

	const equipoId = equipo![0].id;

	const { error: errorEquipoUsusario } = await supabase.from("Usuarios_Equipos").insert({
		admin: true,
		created_at: new Date().toISOString(),
		equipo: equipoId!,
		usuario: user.id,
	});

	if (errorEquipo) {
		return redirect("/nuevo-equipo?error=" + errorEquipo.code);
	}
	if (errorEquipoUsusario) {
		return redirect("/nuevo-equipo?error=" + errorEquipoUsusario.code);
	}

	revalidatePath("/", "layout");
	redirect("/" + nombreEquipo.toLowerCase().replace(/ /g, "-"));
}
