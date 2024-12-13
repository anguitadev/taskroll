import { createClient } from "@/utils/supabase/server";

export async function getDocumentosByEntornoSlug(entornoSlug: string) {
	const supabase = await createClient();

	const { data: entornoId } = await supabase
		.from("Entornos")
		.select("id")
		.eq("slug", entornoSlug)
		.limit(1)
		.single();

	if (!entornoId) return null;
	const { data } = await supabase.from("Documentos").select("*").eq("entorno", entornoId.id);
	return data;
}
