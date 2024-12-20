"use server";
import { createClient } from "@/utils/supabase/server";
import { getUsuario } from "../auth/data";
import { getUltimoMarcaje } from "./data";

export async function marcarEntrada() {
	const supabase = await createClient();
	const usuario = await getUsuario();
	if (!usuario) return;

	const ultimoMarcaje = await getUltimoMarcaje();

	console.log(ultimoMarcaje);

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
	const supabase = await createClient();
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

export async function deleteIncidenciaById(incidenciaId: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Incidencias").delete().eq("id", incidenciaId);
	if (error) throw error;
}
