import { createClient } from "@/utils/supabase/server";
import { getUsuario } from "../auth/data";

export async function getEntornosByEquipoId(equipoId: string) {
	const supabase = await createClient();

	const usuario = await getUsuario();
	if (!usuario) return [];

	// Fetch los entornos del usuario
	const { data: usuarios_entornos } = await supabase
		.from("Usuarios_Entornos")
		.select("entorno")
		.eq("usuario", usuario.id);

	// Convertir los IDs de entornos a un array
	const entornoIds = usuarios_entornos?.map(entorno => entorno.entorno);
	if (!entornoIds) return [];

	// Fetch los entornos del equipo
	const { data } = await supabase
		.from("Entornos")
		.select("id")
		.is("entorno", null)
		.eq("equipo", equipoId)
		.in("id", entornoIds);

	return data;
}
