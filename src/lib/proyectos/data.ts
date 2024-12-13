import { createClient } from "@/utils/supabase/server";

export async function getProyectosByEntornoId(entornoId: string) {
    const supabase = await createClient();

    const { data } = await supabase.from("Entornos").select("*").eq("entorno", entornoId);

    return data;
}