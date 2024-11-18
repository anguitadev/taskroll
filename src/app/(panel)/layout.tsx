import Sidebar from "@/components/dashboard/sidebar";
import { getEquiposByIdUsuario, getUsuario } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const usuario = await getUsuario();

	const equipos = await getEquiposByIdUsuario(usuario!.id);

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
