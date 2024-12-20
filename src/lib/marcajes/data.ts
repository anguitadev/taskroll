import { createClient } from "@/utils/supabase/server";
import { getUsuario } from "../auth/data";

export async function getUltimoMarcaje() {
    const supabase = await createClient();
    const usuario = await getUsuario();
    if(!usuario) return;
    const { data } = await supabase
        .from("Marcajes")
        .select("id, entrada, salida, entrada_2, salida_2")
        .or("salida.is.null,salida_2.is.null")
        .eq("usuario", usuario.id)
        .order("entrada", { ascending: false })
        .limit(1);
    return data;
}