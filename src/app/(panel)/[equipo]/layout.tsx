import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function EquipoLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ equipo: string }>;
}) {
	const slug = (await params).equipo;

	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data: equipos } = await supabase
		.from("Usuarios_Equipos")
		.select(`Equipos(*)`)
		.eq("usuario", user!.id)
		.eq("Equipos.slug", slug);

	let existe = false;

	equipos?.forEach(equipo => {
		if (equipo.Equipos) existe = true;
	});

	return existe ? <>{children}</> : redirect("/error?error=equipo_no_encontrado");
}
