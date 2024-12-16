"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUsuario, getUsuarioByNombreUsuario, getUsuariosByEquipoSlug } from "../auth/data";
import { getEquipoByEntornoId, getEquipoBySlug } from "../equipos/data";
import { removeUsuarioProyecto } from "../proyectos/actions";
import { getProyectosByEntornoId, getUsuariosByProyectoId } from "../proyectos/data";
import {
	getAdminCountEntorno,
	getEntornoById,
	getEntornoProyectoBySlug,
	getUsuariosByEntornoId,
	getUsuariosByEntornoSlug,
	isEntornoAdminByUsuarioId,
} from "./data";

export async function createEntorno({
	nombreEntorno,
	descripcionEntorno,
	colorEntorno,
	equipo,
}: {
	nombreEntorno: string;
	descripcionEntorno: string;
	colorEntorno: string;
	equipo: { id: string; nombre: string; slug: string; color: string };
}) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let slug = nombreEntorno
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-");

	const { data: entorno } = await supabase.from("Entornos").select("*").like("slug", slug);

	if (entorno && entorno.length > 0) {
		slug += "-" + entorno.length;
	}

	const { data, error: errorEntornos } = await supabase
		.from("Entornos")
		.insert({
			nombre: nombreEntorno,
			descripcion: descripcionEntorno,
			color: colorEntorno,
			propietario: user!.id,
			slug: slug,
			equipo: equipo.id,
		})
		.select();

	if (!data || errorEntornos) {
		return console.log(errorEntornos);
	}

	await createPizarra(data[0].id);

	const { error } = await supabase.from("Usuarios_Entornos").insert({
		entorno: data![0].id,
		usuario: user!.id,
		admin: true,
	});

	if (error) {
		console.log(error);
	} else {
		revalidatePath("/", "layout");
		redirect("/" + equipo.slug + "/" + data![0].slug);
	}
}

export async function createPizarra(idEntorno: string) {
	const supabase = await createClient();

	const { error } = await supabase.from("Pizarras").insert({
		entorno: idEntorno,
	});

	if (error) {
		console.log(error);
	}
}

export async function updateEntornoById(entornoId: string, nombre: string, descripcion: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("Entornos")
		.update({ nombre: nombre, descripcion: descripcion })
		.eq("id", entornoId);
	if (error) throw new Error("Ha habido un error al actualizar el entorno.");
}

export async function addUsuarioToEntorno(nombre_usuario: string, entornoSlug: string) {
	const entorno = await getEntornoProyectoBySlug(entornoSlug);
	if (!entorno) throw new Error("Entorno no encontrado");

	const usuario = await getUsuarioByNombreUsuario(nombre_usuario);
	if (!usuario) throw new Error("Usuario no encontrado");

	if (entorno.entorno === null) {
		const equipo = await getEquipoByEntornoId(entorno.id);
		if (!equipo?.Equipos) throw new Error("Equipo padre no encontrado");
		const usuariosEquipo = await getUsuariosByEquipoSlug(equipo.Equipos.slug);
		if (!usuariosEquipo?.find(user => user.Usuarios?.id === usuario.id)) {
			throw new Error("El usuario no está asignado al equipo.");
		}
	} else {
		const entornoPadre = await getEntornoById(entorno.entorno);
		if (!entornoPadre) throw new Error("Entorno padre no encontrado");
		const usuariosEntorno = await getUsuariosByEntornoId(entorno.entorno);
		if (!usuariosEntorno?.find(user => user.Usuarios?.id === usuario.id)) {
			throw new Error("El usuario no está asignado al entorno padre.");
		}
	}

	const usuariosEntorno = await getUsuariosByEntornoSlug(entornoSlug);

	if (usuariosEntorno?.find(user => user.Usuarios?.id === usuario.id)) {
		throw new Error("El usuario ya pertenece al entorno/proyecto");
	}

	const supabase = await createClient();
	const { error } = await supabase.from("Usuarios_Entornos").insert({
		entorno: entorno.id,
		usuario: usuario.id,
		admin: false,
	});

	if (error) throw new Error("Ha habido un error al asignar el usuario.");
}

export async function addUsuarioToEquipo(nombre_usuario: string, equipoSlug: string) {
	const equipo = await getEquipoBySlug(equipoSlug);
	if (!equipo) throw new Error("Equipo no encontrado");

	const usuario = await getUsuarioByNombreUsuario(nombre_usuario);
	if (!usuario) throw new Error("Usuario no encontrado");

	const usuariosEquipo = await getUsuariosByEquipoSlug(equipoSlug);

	if (usuariosEquipo?.find(user => user.Usuarios?.id === usuario.id)) {
		throw new Error("El usuario ya pertenece al equipo");
	}

	const supabase = await createClient();
	const { error } = await supabase.from("Usuarios_Equipos").insert({
		equipo: equipo.id,
		usuario: usuario.id,
		admin: false,
	});

	if (error) throw new Error("Ha habido un error al asignar el usuario.");
}

export async function removeUsuarioEntorno(usuarioId: string, entornoId: string) {
	const entorno = await getEntornoById(entornoId);
	if (entorno && entorno.entorno) {
		await removeUsuarioProyecto(usuarioId, entornoId);
		return;
	}

	let adminCount = await getAdminCountEntorno(entornoId);
	const isAdmin = await isEntornoAdminByUsuarioId(usuarioId, entornoId);

	if (isAdmin) adminCount--;

	if (adminCount == 0) throw new Error("El entorno debe tener al menos un admin");

	const proyectosEntorno = await getProyectosByEntornoId(entornoId);

	if (proyectosEntorno) {
		for (const proyecto of proyectosEntorno) {
			const usuariosProyecto = await getUsuariosByProyectoId(proyecto.id);
			if (
				usuariosProyecto &&
				usuariosProyecto.find(usuario => usuario.Usuarios?.id == usuarioId)
			) {
				try {
					await removeUsuarioProyecto(usuarioId, proyecto.id);
				} catch (error) {
					if (error)
						throw new Error(
							"No se ha podido eliminar el usuario del proyecto " + proyecto.nombre,
						);
				}
			}
		}
	}

	const supabase = await createClient();
	const { error } = await supabase
		.from("Usuarios_Entornos")
		.delete()
		.eq("entorno", entornoId)
		.eq("usuario", usuarioId);
	if (error) throw error;
}

export async function updateUsuarioRolEntorno(
	newRol: string,
	idUsuario: string,
	idEntorno: string,
) {
	const adminCount = await getAdminCountEntorno(idEntorno);

	if (newRol == "miembro" && adminCount == 1)
		throw new Error("El entorno debe tener al menos un admin");

	const supabase = await createClient();

	const rol = newRol === "admin" ? true : false;

	const { error } = await supabase
		.from("Usuarios_Entornos")
		.update({ admin: rol })
		.eq("entorno", idEntorno)
		.eq("usuario", idUsuario);

	if (error) throw error;
}

export async function deleteEntornoById(entornoId: string) {
	const usuario = await getUsuario();
	if (!usuario) return;
	const isAdmin = await isEntornoAdminByUsuarioId(usuario.id, entornoId);
	if (!isAdmin) return;
	
	const supabase = await createClient();
	const { error } = await supabase.from("Entornos").delete().eq("id", entornoId);
	if (error) throw error;
}
