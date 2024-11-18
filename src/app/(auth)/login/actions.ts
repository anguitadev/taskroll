"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getEquipoSlugByUsuarioId } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";

export default async function login(formData: FormData) {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { data: user, error } = await supabase.auth.signInWithPassword(data);

	const usuario = user.user;

	if (error) {
		return redirect("/login?error=" + error.code);
	}


	const equipoSlug = await getEquipoSlugByUsuarioId(usuario!.id);

	if (!equipoSlug) {
		revalidatePath("/", "layout");
		redirect("/nuevo-equipo");
	} else {
		revalidatePath("/", "layout");
		redirect("/" + equipoSlug);
	}
}
