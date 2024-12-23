"use server";
import { createClient } from "@/utils/supabase/server";
import { UTApi } from "uploadthing/server";
import { getUsuario } from "../auth/data";

export async function deleteDocumentoByUrl(documentoUrl: string) {
	const utapi = new UTApi();
	await utapi.deleteFiles(documentoUrl);
	const supabase = await createClient();
	const { error } = await supabase.from("Documentos").delete().eq("url", documentoUrl);
	if (error) throw error;
}

export async function createDocumento(
	fileKey: string,
	nombreDocumento: string,
	pathname: string,
	destinatario?: string,
) {
	if (pathname === "nomina" && destinatario) {
		const usuario = await getUsuario();
		const supabase = await createClient();
		const { error } = await supabase.from("Documentos").insert({
			nombre: nombreDocumento,
			url: fileKey,
			propietario: usuario!.id,
			destinatario: destinatario,
		});
		if (error) return error;
	} else {
		const slugs = pathname.split("/");
		const entorno = slugs[slugs.indexOf("documentos") - 1];

		if (entorno) {
			const supabase = await createClient();

			const { data: entornoId } = await supabase
				.from("Entornos")
				.select("id")
				.eq("slug", entorno)
				.limit(1)
				.single();

			if (entornoId) {
				const usuario = await getUsuario();
				const { error } = await supabase.from("Documentos").insert({
					nombre: nombreDocumento,
					url: fileKey,
					entorno: entornoId.id,
					propietario: usuario!.id,
				});
				if (error) return error;
			}
		}
	}
}
