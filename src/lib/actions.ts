"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEntornoById, getEquipoByEntornoId } from "./data";

export async function createEntorno({
	nombreEntorno,
	descripcionEntorno,
	colorEntorno,
	equipo,
}: {
	nombreEntorno: string;
	descripcionEntorno: string;
	colorEntorno: string;
	equipo: { id: string; nombre: string; slug: string; color: string };
}) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	console.log(await supabase.auth.getUser());

	let slug = nombreEntorno
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-");

	const { data: entorno } = await supabase.from("Entornos").select("*").like("slug", slug);

	if (entorno && entorno.length > 0) {
		slug += "-" + entorno.length;
	}

	const { data, error: errorEntornos } = await supabase
		.from("Entornos")
		.insert({
			nombre: nombreEntorno,
			descripcion: descripcionEntorno,
			color: colorEntorno,
			propietario: user!.id,
			slug: slug,
			equipo: equipo.id,
		})
		.select();

	const { error } = await supabase.from("Usuarios_Entornos").insert({
		entorno: data![0].id,
		usuario: user!.id,
		admin: true,
	});

	if (error || errorEntornos) {
		return {
			error: error?.code,
		};
	} else {
		revalidatePath("/", "layout");
		redirect("/" + equipo.slug + "/" + data![0].slug);
	}
}

export async function createProyecto(nombreProyecto: string, idEntorno: string) {
	const supabase = await createClient();

	let proyectoSlug = nombreProyecto
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-");

	const { data: proyecto } = await supabase
		.from("Proyectos")
		.select("*")
		.like("slug", proyectoSlug);

	if (proyecto && proyecto.length > 0) {
		proyectoSlug += "-" + proyecto.length;
	}

	const { data: proyectoNuevo, error } = await supabase
		.from("Proyectos")
		.insert({
			nombre: nombreProyecto,
			slug: proyectoSlug,
			entorno: idEntorno,
		})
		.select()
		.single();

	if (error) {
		console.log(error);
		return {
			error: error?.code,
		};
	} else {
		const entorno = await getEntornoById(idEntorno);

		const equipo = await getEquipoByEntornoId(idEntorno);

		revalidatePath("/");
		redirect("/" + equipo!.Equipos!.slug + "/" + entorno!.slug + "/" + proyectoNuevo!.slug);
	}
}