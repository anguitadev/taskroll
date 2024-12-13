import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const {
    data: { user },
} = await supabase.auth.getUser();

export async function marcarEntrada() {
    await supabase
        .from("marcajes")
        .insert({
            usuario: user!.id,
            entrada: Date.now(),
        })
        .select();
}

export async function marcarSalida() {
    const { data } = await supabase
        .from("marcajes")
        .select("id")
        .eq("usuario", user!.id)
        .eq("salida", null)
        .order("entrada", { ascending: false })
        .limit(1);

    if (data && data.length > 0) {
        await supabase
            .from("marcajes")
            .update({
                salida: Date.now(),
            })
            .eq("id", data[0].id);
    } else {
        await supabase.from("marcajes").insert({
            usuario: user!.id,
            entrada: Date.now(),
        });
    }
}
