import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";

export async function getProyectosByEntornoId(id: string) {
	const supabase = createClient();

	const usuario = await getUsuario();

	const { data: usuarios_entornos } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno")
		.eq("usuario", usuario.id);

	const entornoIds = usuarios_entornos?.map(entorno => entorno.entorno);

	const { data } = await supabase
		.from("Entornos")
		.select("*")
		.eq("entorno", id)
		.in("id", entornoIds!);

	return data;
}
