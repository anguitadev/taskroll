import { createClient } from "@/utils/supabase/client";

export async function updatePizarra(slugEntorno: string, contenido: string) {
	const supabase = createClient();
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
