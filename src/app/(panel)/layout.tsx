import Sidebar from "@/components/dashboard/sidebar";
import { getUsuario } from "@/lib/auth/data";
import {
	getEntornosbyUsuario,
	getEquiposByIdUsuario,
	getProyectosbyEntornos,
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

	let proyectos;

	// Recibir los proyectos
	//REHACER ESTO: SE TIENEN QUE RECIBIR LOS PROYECTOS QUE ESTÉN ASOCIADOS AL USUARIO
	if (entornos) proyectos = await getProyectosbyEntornos(entornos);

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
