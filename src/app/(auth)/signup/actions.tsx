"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function signup(formData: FormData) {
	const supabase = await createClient();

	const { email, password, username, nombreCompleto } = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		username: formData.get("username") as string,
		nombreCompleto: formData.get("nombreCompleto") as string,
	};

	const { data: usuarios, error: fetchError } = await supabase
		.from("Usuarios")
		.select("nombre_usuario")
		.eq("nombre_usuario", username);

	if (fetchError || (usuarios && usuarios.length > 0)) {
		return redirect("/signup?error=user_exists");
	}

	const { data, error: signupError } = await supabase.auth.signUp({ email, password });

	if (signupError || !data?.user?.id) {
		return redirect("/signup?error=" + signupError?.code);
	}

	const { error: userInsertError } = await supabase.from("Usuarios").insert({
		id: data.user.id,
		nombre_completo: nombreCompleto,
		nombre_usuario: username,
	});

	if (userInsertError) {
		return redirect("/signup?error=signup_failed");
	} else {
		revalidatePath("/", "layout");
		return redirect("/dashboard");
	}
}
