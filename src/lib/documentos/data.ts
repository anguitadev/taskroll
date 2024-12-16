import { createClient } from "@/utils/supabase/server";
import { getUsuario } from "../auth/data";
import { getEntornoById } from "../entornos/data";
import { getEquipoBySlug } from "../equipos/data";
import { getEntornosbyUsuario } from "../panel/data";
import { DocumentoEntorno } from "./types";

export async function getDocumentosByEntornoSlug(entornoSlug: string) {
	const supabase = await createClient();

	const { data: entornoId } = await supabase
		.from("Entornos")
		.select("id")
		.eq("slug", entornoSlug)
		.limit(1)
		.single();

	if (!entornoId) return null;
	const { data } = await supabase.from("Documentos").select("*").eq("entorno", entornoId.id);
	return data;
}

export async function getDocumentosByEquipoSlug(equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);

	const supabase = await createClient();

	const usuario = await getUsuario();

	const entornosUsuario = await getEntornosbyUsuario();

	if (entornosUsuario && equipo) {
		const entornosUsuarioEnEquipo = await Promise.all(
			entornosUsuario.map(async entorno => {
				if (entorno.Entornos) {
					if (entorno.Entornos.entorno === null) {
						return entorno.Entornos.equipo === equipo.id ? entorno : null;
					} else {
						const entornoProyecto = await getEntornoById(entorno.Entornos.entorno);
						if (entornoProyecto) {
							return entornoProyecto.equipo === equipo.id ? entorno : null;
						}
					}
				}
				return null;
			}),
		);

		const filteredEntornosUsuarioEnEquipo = entornosUsuarioEnEquipo.filter(
			entorno => entorno !== null,
		);

		const entornosId = filteredEntornosUsuarioEnEquipo.map(entorno => entorno.Entornos?.id);

		const entornosIdString = entornosId.join(",");

		const { data } = await supabase
			.from("Documentos")
			.select("*, entorno(nombre, slug, entorno(nombre, slug))")
			.or(`entorno.in.(${entornosIdString}),destinatario.eq.${usuario?.id}`);

		if (data) return data as unknown as DocumentoEntorno[];
	}
}
