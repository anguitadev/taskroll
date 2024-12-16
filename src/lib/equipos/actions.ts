"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { removeUsuarioEntorno } from "../entornos/actions";
import { getAllEntornosByEquipoId, getUsuariosByEntornoId } from "../entornos/data";
import { getAdminCountEquipo, getEquipoById, isEquipoAdminByUsuarioId } from "./data";

export async function removeUsuarioEquipo(usuarioId: string, equipoId: string) {
	let adminCount = await getAdminCountEquipo(equipoId);
	const isAdmin = await isEquipoAdminByUsuarioId(usuarioId, equipoId);

	if (isAdmin) adminCount--;

	if (adminCount == 0) throw new Error("El equipo debe tener al menos un admin");

	const entornosEquipo = await getAllEntornosByEquipoId(equipoId);

	if (entornosEquipo) {
		for (const entorno of entornosEquipo) {
			const usuariosEntorno = await getUsuariosByEntornoId(entorno.id);
			if (
				usuariosEntorno &&
				usuariosEntorno.find(usuario => usuario.Usuarios?.id == usuarioId)
			) {
				try {
					await removeUsuarioEntorno(usuarioId, entorno.id);
				} catch (error) {
					if (error)
						throw new Error(
							"No se ha podido eliminar el usuario del entorno " + entorno.nombre,
						);
				}
			}
		}
	}

	const supabase = await createClient();
	const { error } = await supabase
		.from("Usuarios_Equipos")
		.delete()
		.eq("equipo", equipoId)
		.eq("usuario", usuarioId);
	if (error) throw error;
}

export async function updateUsuarioRolEquipo(newRol: string, idUsuario: string, idEquipo: string) {
	const adminCount = await getAdminCountEquipo(idEquipo);

	if (newRol == "miembro" && adminCount == 1)
		throw new Error("El equipo debe tener al menos un admin");

	const supabase = await createClient();

	const rol = newRol === "admin" ? true : false;

	const { error } = await supabase
		.from("Usuarios_Equipos")
		.update({ admin: rol })
		.eq("equipo", idEquipo)
		.eq("usuario", idUsuario);

	if (error) throw error;
}

export async function updateEquipo({
	idEquipo,
	nombreEquipo,
	slugEquipo,
	colorEquipo,
}: {
	idEquipo: string;
	nombreEquipo: string;
	slugEquipo: string;
	colorEquipo: string;
}) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("Equipos")
		.update({
			nombre: nombreEquipo,
			slug: slugEquipo,
			color: colorEquipo,
		})
		.eq("id", idEquipo);

	if (error) {
		const equipo = await getEquipoById(idEquipo);
		if (equipo) {
			revalidatePath("/" + equipo.slug + "/ajustes/equipo");
			redirect("/" + equipo.slug + "/ajustes/equipo?error=" + error.code);
		}
	} else {
		revalidatePath("/");
		redirect("/" + slugEquipo + "/ajustes/equipo?success=" + "equipo_actualizado");
	}
}

export async function deleteEquipo(idEquipo: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Equipos").delete().eq("id", idEquipo);

	const { data: usuario } = await supabase.auth.getUser();

	if (error) {
		console.log(error);
		redirect("/ajustes/equipos?error=" + error.code);
	}

	const { data: equipo } = await supabase
		.from("Usuarios_Equipos")
		.select("Equipos(slug)")
		.eq("usuario", usuario.user!.id)
		.limit(1);

	if (!equipo || equipo.length == 0) {
		revalidatePath("/", "layout");
		redirect("/nuevo-equipo");
	} else {
		revalidatePath("/", "layout");
		redirect("/" + equipo[0].Equipos!.slug);
	}
}
