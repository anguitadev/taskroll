import NuevoUsuario from "@/components/ajustes/nuevo-usuario";
import TablaUsuarios from "@/components/ajustes/tabla-usuarios";
import { getUsuario, getUsuariosByEquipoSlug, isUsuarioEquipoAdmin } from "@/lib/data";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";

type Params = Promise<{ equipo: string }>;
export default async function Miembros(props: { params: Params }) {
	const params = await props.params;
	const equipoSlug = params.equipo;

	const isAdmin = await isUsuarioEquipoAdmin(equipoSlug);

	if (!isAdmin) return notFound();

	const usuariosEquipo = await getUsuariosByEquipoSlug(equipoSlug);

	const usuarioLoggeado = await getUsuario();

	if (!usuarioLoggeado) return notFound();

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Miembros del Equipo</span>
			</div>
			<div className="max-h-[calc(100vh-70px)] w-full overflow-y-scroll p-8">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<h1 className="text-3xl font-semibold">Miembros del Equipo</h1>
						<span className="text-sm text-neutral-400">
							Estos son los usuarios que forman parte del equipo.
						</span>
					</div>
					<button
						className="mb-2 flex items-center gap-2 rounded border border-indigo-700 bg-indigo-600 px-2 py-1 text-sm text-neutral-100"
						popoverTarget="nuevo-usuario"
					>
						<Plus className="size-5" />
						Añadir Usuario
					</button>
				</div>
				{usuariosEquipo && (
					<TablaUsuarios
						usuarios={usuariosEquipo}
						usuarioLoggeado={usuarioLoggeado.id}
					/>
				)}
			</div>
			<NuevoUsuario equipoSlug={equipoSlug} />
		</>
	);
}
