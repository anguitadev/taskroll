import { createClient } from "@/utils/supabase/server";

export async function getProyectosByEntornoId(entornoId: string) {
    const supabase = await createClient();

    const { data } = await supabase.from("Entornos").select("*").eq("entorno", entornoId);

    return data;
}

export async function getProyectoBySlug(slug: string) {
	const supabase = await createClient();

	const { data } = await supabase.from("Entornos").select("*").eq("slug", slug).limit(1).single();

	return data;
}

export async function getUsuariosByProyectoId(proyectoId: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("Usuarios_Entornos")
		.select("Usuarios(*)")
		.eq("entorno", proyectoId);
	return data;
}