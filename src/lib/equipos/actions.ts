import { createClient } from "@/utils/supabase/server";
import { getAllEntornosByEquipoId } from "../data";
import { removeUsuarioEntorno } from "../entornos/actions";
import { getUsuariosByEntornoId } from "../entornos/data";
import { getAdminCountEquipo, isEquipoAdminByUsuarioId } from "./data";

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
