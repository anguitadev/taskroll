import { createClient } from "@/utils/supabase/server";
import { getEntornoBySlug } from "../entornos/data";
import { getProyectoBySlug } from "../proyectos/data";

export async function getPizarraFromEntorno(entornoSlug: string) {
	const supabase = await createClient();

	const entorno = await getEntornoBySlug(entornoSlug);
	if (!entorno) return;

	const { data } = await supabase
		.from("Pizarras")
		.select("contenido")
		.eq("entorno", entorno.id)
		.limit(1)
		.single();

	return data;
}

export async function getPizarraFromProyecto(proyectoSlug: string) {
	const supabase = await createClient();

	const proyecto = await getProyectoBySlug(proyectoSlug);

	const { data } = await supabase
		.from("Pizarras")
		.select("contenido")
		.eq("entorno", proyecto!.id)
		.limit(1)
		.single();

	return data;
}