import { createClient } from "@/utils/supabase/client";
import { getUsuario } from "../auth/data-client";
import { getUltimoMarcaje } from "./data-client";

export async function marcarEntrada() {
    const supabase = createClient();
	const usuario = await getUsuario();

	const ultimoMarcaje = await getUltimoMarcaje();

	if (ultimoMarcaje && ultimoMarcaje.length > 0) {
		if (ultimoMarcaje[0].salida) {
			await supabase
				.from("Marcajes")
				.update({
					entrada_2: new Date().toISOString(),
				})
				.eq("id", ultimoMarcaje[0].id);
		}
	} else {
		await supabase.from("Marcajes").insert({
			usuario: usuario.id,
			entrada: new Date().toISOString(),
		});
	}
}

export async function marcarSalida() {
    const supabase = createClient();
	const ultimoMarcaje = await getUltimoMarcaje();

	if (ultimoMarcaje && ultimoMarcaje.length > 0) {
		if (!ultimoMarcaje[0].salida) {
			await supabase
				.from("Marcajes")
				.update({
					salida: new Date().toISOString(),
				})
				.eq("id", ultimoMarcaje[0].id);
		} else if (!ultimoMarcaje[0].salida_2) {
			await supabase
				.from("Marcajes")
				.update({
					salida_2: new Date().toISOString(),
				})
				.eq("id", ultimoMarcaje[0].id);
		}
	}
}
