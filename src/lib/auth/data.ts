import { Tables } from "@/db.types";
import { createClient } from "@/utils/supabase/server";

export async function getUsuario() {
	const supabase = await createClient();

    //Recibir usuario loggeado
	const {
		data: { user },
	} = await supabase.auth.getUser();

    // Recibir datos del usuario de la tabla public
	if (user) {
		const { data } = await supabase
			.from("Usuarios")
			.select("*")
			.eq("id", user.id)
			.limit(1)
			.returns<Tables<"Usuarios">[]>()
            .single();
		if (data) {
			return data;
		}
	}
}
