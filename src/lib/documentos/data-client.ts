import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";
import { Nomina } from "./types";

export async function getNominasByUsuarioId(usuarioId: string) {
	const supabase = createClient();

	const usuario = await getUsuario();
	if (!usuario) return;

	const { data: usuarios_equipos } = await supabase
		.from("Usuarios_Equipos")
		.select("id")
		.eq("usuario", usuario.id)
		.eq("admin", true);

	if (!usuarios_equipos) return;

	const { data } = await supabase
		.from("Documentos")
		.select("*")
		.eq("destinatario", usuarioId)
		.eq("propietario", usuario.id);

	if (data) return data as unknown as Nomina[];
}
