import Sidebar from "@/components/dashboard/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const {data: usuario} = await supabase
		.from("Usuarios")
		.select(`*`)
		.eq("id", user!.id).single();

	const {data: equipos} = await supabase
		.from("Usuarios_Equipos")
		.select(`Equipos(*)`)
		.eq("usuario", user!.id);

	if (!equipos || equipos.length == 0) {
		redirect("/nuevo-equipo");
	} else {
		return (
			<div className="flex min-h-screen w-screen flex-row gap-4 p-2 font-sans">
				<Sidebar className="w-64 min-w-64 max-w-64" equipos={equipos} usuario={usuario!} />
				<div className="grow rounded-lg border border-neutral-800 bg-neutral-900">
					{children}
				</div>
			</div>
		);
	}
}
