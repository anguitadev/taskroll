import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";

export async function getUltimoMarcaje() {
	const supabase = createClient();
	const { data } = await supabase
		.from("Marcajes")
		.select("id, entrada, salida, entrada_2, salida_2")
		.or("salida.is.null,salida_2.is.null")
		.order("entrada", { ascending: false })
		.limit(1);
	return data;
}

export async function getMarcajes() {
	const supabase = createClient();

	const usuario = await getUsuario();

	const { data } = await supabase
		.from("Marcajes")
		.select("entrada, salida, entrada_2, salida_2")
		.eq("usuario", usuario.id)
		.order("entrada", { ascending: false });

	return data ?? [];
}

export async function getIncidencias() {
	const supabase = createClient();

	const usuario = await getUsuario();

	const { data } = await supabase
		.from("Incidencias")
		.select("*")
		.range(0, 9)
		.eq("usuario", usuario.id);

	return data;
}
