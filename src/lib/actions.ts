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

	if (!data || errorEntornos) {
		return console.log(errorEntornos);
	}

	await createPizarra(data[0].id);

	const { error } = await supabase.from("Usuarios_Entornos").insert({
		entorno: data![0].id,
		usuario: user!.id,
		admin: true,
	});

	if (error) {
		console.log(error);
	} else {
		revalidatePath("/", "layout");
		redirect("/" + equipo.slug + "/" + data![0].slug);
	}
}

export async function createPizarra(idEntorno: string) {
	const supabase = await createClient();

	const { error } = await supabase.from("Pizarras").insert({
		entorno: idEntorno
	});

	if (error) {
		console.log(error);
	}
}

export async function createProyecto(
	nombreProyecto: string,
	descripcionProyecto: string,
	idEntorno: string,
) {
	const supabase = await createClient();

	let proyectoSlug = nombreProyecto
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-");

	const { data: proyecto } = await supabase
		.from("Entornos")
		.select("*")
		.like("slug", proyectoSlug);

	if (proyecto && proyecto.length > 0) {
		proyectoSlug += "-" + proyecto.length;
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data: proyectoNuevo, error } = await supabase
		.from("Entornos")
		.insert({
			nombre: nombreProyecto,
			descripcion: descripcionProyecto,
			slug: proyectoSlug,
			entorno: idEntorno,
			propietario: user!.id,
		})
		.select()
		.single();

	if (error) {
		console.log(error);
		return {
			error: error?.code,
		};
	} else {

		createPizarra(proyectoNuevo!.id);

		const entorno = await getEntornoById(idEntorno);

		const equipo = await getEquipoByEntornoId(idEntorno);

		revalidatePath("/");
		redirect("/" + equipo!.Equipos!.slug + "/" + entorno!.slug + "/" + proyectoNuevo!.slug);
	}
}

export async function deleteDocumento(pathname: string) {
	const slugs = pathname.split("/");
	const urlDocumento = slugs.pop();
	const supabase = await createClient();
	const { error } = await supabase.from("Documentos").delete().eq("url", urlDocumento!);
	if (error) {
		return error;
	}
	console.log(pathname);
	revalidatePath(slugs.join("/"));
	redirect(slugs.join("/"));
}

export async function createDocumento(fileKey: string, nombreDocumento: string, pathname: string) {
	const slugs = pathname.split("/");
	const entorno = slugs[slugs.indexOf("documentos") - 1];
	const supabase = await createClient();
	const { data: entornoId } = await supabase
		.from("Entornos")
		.select("id")
		.eq("entorno", entorno)
		.limit(1)
		.single();
	const { error } = await supabase.from("Documentos").insert({
		nombre: nombreDocumento,
		url: fileKey,
		entorno: entornoId!.id,
	});
	if (error) return error;
	revalidatePath(pathname + "/" + fileKey);
	redirect(pathname + "/" + fileKey);
}

export async function updatePizarra(slugEntorno: string, contenido: string) {
	const supabase = await createClient();
	const { data: entorno } = await supabase
		.from("Entornos")
		.select("id")
		.eq("slug", slugEntorno)
		.limit(1)
		.single();
	if (entorno) {
		const { error } = await supabase
			.from("Pizarras")
			.update({ contenido: contenido })
			.eq("entorno", entorno.id);
		if (error) throw error;
	}
}
