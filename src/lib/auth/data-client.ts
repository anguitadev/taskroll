import { createClient } from "@/utils/supabase/client";

// Devolver usuario loggeado desde el cliente
export async function getUsuario() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data } = await supabase
			.from("Usuarios")
			.select("*")
			.eq("id", user.id)
			.limit(1)
			.single();
		if (data) {
			return data;
		}
	}
}