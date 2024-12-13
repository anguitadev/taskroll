import Sidebar from "@/components/dashboard/sidebar";
import { getUsuario } from "@/lib/auth/data";
import {
	getEntornosbyUsuario,
	getEquiposByIdUsuario
} from "@/lib/panel/data";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	// Si el usuario no esta loggeado, redirigir a la pagina de login
	const usuario = await getUsuario();
	if (!usuario) redirect("/login");

	//Recibir los equipos del usuario
	const equipos = await getEquiposByIdUsuario(usuario.id);

	//Recibir los entornos del usuario
	const entornos = await getEntornosbyUsuario();

	// Cargar los proyectos
	const proyectos = entornos?.reduce(
		(acc, entorno) => {
			if (entorno.Entornos.entorno) {
				if (!acc[entorno.Entornos.entorno]) {
					acc[entorno.Entornos.entorno] = [];
				}
				acc[entorno.Entornos.entorno].push({
					id: entorno.Entornos.id,
					nombre: entorno.Entornos.nombre,
					slug: entorno.Entornos.slug,
				});
			}
			return acc;
		},
		{} as Record<string, { id: string; nombre: string; slug: string }[]>,
	);

	// Si el usuario no tiene ningún equipo, redirigir a la pagina de nuevo equipo
	if (!equipos || equipos.length == 0) {
		redirect("/nuevo-equipo");
	} else {
		return (
			<div className="flex h-screen max-h-screen w-screen flex-row gap-4 overflow-hidden font-sans sm:p-2">
				<Sidebar
					className="w-42 lg:w-64 lg:min-w-64 lg:max-w-64"
					equipos={equipos}
					usuario={usuario}
					entornos={entornos || []}
					proyectos={proyectos}
				/>
				<div className="max-h-screen max-w-full grow rounded-lg border border-neutral-800 bg-neutral-900">
					{children}
				</div>
			</div>
		);
	}
}
