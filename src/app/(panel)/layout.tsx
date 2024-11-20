import Sidebar from "@/components/dashboard/sidebar";
import { getEntornosbyUsuario, getEquiposByIdUsuario, getProyectosbyEntornos, getUsuario } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const usuario = await getUsuario();

	const equipos = await getEquiposByIdUsuario(usuario!.id);

	const entornos = await getEntornosbyUsuario();

	const proyectos = await getProyectosbyEntornos(entornos!);

	if (!equipos || equipos.length == 0) {
		redirect("/nuevo-equipo");
	} else {
		return (
			<div className="flex h-screen max-h-screen overflow-hidden w-screen flex-row gap-4 sm:p-2 font-sans">
				<Sidebar className="w-42 lg:w-64 lg:min-w-64 lg:max-w-64" equipos={equipos} usuario={usuario!} entornos={entornos!} proyectos={proyectos} />
				<div className="grow rounded-lg border border-neutral-800 bg-neutral-900 max-w-full max-h-screen">
					{children}
				</div>
			</div>
		);
	}
}
