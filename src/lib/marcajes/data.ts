import { createClient } from "@/utils/supabase/server";

export async function getUltimoMarcaje() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("Marcajes")
        .select("id, entrada, salida, entrada_2, salida_2")
        .or("salida.is.null,salida_2.is.null")
        .order("entrada", { ascending: false })
        .limit(1);
    return data;
}