import { createClient } from "@/utils/supabase/server";
import { getEntornoBySlug } from "../entornos/data";

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
