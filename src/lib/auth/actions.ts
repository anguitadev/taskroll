"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEquipoSlugByUsuarioId } from "../equipos/data";
import { getUsuario } from "./data";

export async function login(formData: FormData) {
	const supabase = await createClient();

	// Recibir los datos
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	// Iniciar sesión
	const { data: user, error } = await supabase.auth.signInWithPassword(data);

	// Mostrar error si falla
	if (error) {
		return redirect("/login?error=" + error.code);
	}

	// Si todo va bien, redirigir al equipo
	if (user.user) {
		const equipoSlug = await getEquipoSlugByUsuarioId(user.user.id);

		if (!equipoSlug) {
			revalidatePath("/", "layout");
			redirect("/nuevo-equipo");
		} else {
			revalidatePath("/", "layout");
			redirect("/" + equipoSlug);
		}
	}
}

export default async function signup(formData: FormData) {
	const supabase = await createClient();

	// Recibir los datos
	const { email, password, username, nombreCompleto } = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		username: formData.get("username") as string,
		nombreCompleto: formData.get("nombreCompleto") as string,
	};

	// Comprobar que no existe el usuario
	const { data: usuarios, error: fetchError } = await supabase
		.from("Usuarios")
		.select("nombre_usuario")
		.eq("nombre_usuario", username)
		.or(`email.eq.${email}`);

	// Mostrar error si existe
	if (fetchError || (usuarios && usuarios.length > 0)) {
		return redirect("/signup?error=user_exists");
	}

	// Crear el usuario en auth
	const { data, error: signupError } = await supabase.auth.signUp({ email, password });

	// Mostrar error si falla
	if (signupError || !data?.user?.id) {
		return redirect("/signup?error=" + signupError?.code);
	}

	// Crear el usuario en public
	const { error: userInsertError } = await supabase.from("Usuarios").insert({
		id: data.user.id,
		nombre_completo: nombreCompleto,
		nombre_usuario: username,
		email: email,
	});

	// Mostrar error si falla o redirigir al nuevo equipo
	if (userInsertError) {
		return redirect("/signup?error=signup_failed");
	} else {
		revalidatePath("/", "layout");
		return redirect("/nuevo-equipo");
	}
}

export async function checkUsuarioLogin() {
	const usuario = await getUsuario(); //Devuelve el usuario loggeado

	const supabase = await createClient();

	//Si el usuario se ha loggeado y tiene un equipo, llevarlo a la pagina del equipo, sino crear uno
	if (usuario) {
		const { data: equipo } = await supabase
			.from("Usuarios_Equipos")
			.select("Equipos(slug)")
			.eq("usuario", usuario.id)
			.limit(1);

		if (!equipo || equipo.length == 0) {
			redirect("/nuevo-equipo");
		} else {
			redirect("/" + equipo[0].Equipos!.slug);
		}
	}
}

export async function updateUsuario(
	nombreCompleto: string,
	nombreUsuario: string,
	color: string,
	puesto: string | null,
) {
	const supabase = await createClient();
	const usuario = await getUsuario();
	if (!usuario) return;
	const { error } = await supabase
		.from("Usuarios")
		.update({
			nombre_completo: nombreCompleto,
			nombre_usuario: nombreUsuario,
			puesto: puesto,
			color: color,
		})
		.eq("nombre_usuario", usuario.nombre_usuario);
	if (error) throw new Error("No se ha podido actualizar el perfil. Pro favor, inténtalo de nuevo.");
}
