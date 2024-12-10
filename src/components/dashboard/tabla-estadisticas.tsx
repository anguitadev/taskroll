import { getCompletadoTareasCountByUserId, getTareasCountByUserId, getUsuariosByEquipoSlug } from "@/lib/data";

type Usuario = {
	admin: boolean;
	Usuarios: {
		color: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	} | null;
}[];

export default async function TablaEstadisticas({ equipoSlug }: { equipoSlug: string }) {
	const usuariosEquipo: Usuario = (await getUsuariosByEquipoSlug(equipoSlug)) ?? [];

	async function fetchCompletadoCount(userId: string) {
		return (await getCompletadoTareasCountByUserId(userId, equipoSlug)) ?? 0;
	}

	async function fetchTotalCount(userId: string) {
		return (await getTareasCountByUserId(userId, equipoSlug)) ?? 0;
	}

	return (
		<table className="mt-2 w-full table-fixed border-separate border-spacing-y-2 p-2 overflow-y-scroll">
			<tbody>
				<tr className="text-xs font-light">
					<th className="border-b border-neutral-700 pb-2">Completadas</th>
					<th className="border-b border-neutral-700 pb-2">Usuario</th>
					<th className="border-b border-neutral-700 pb-2">Totales</th>
				</tr>
				{usuariosEquipo.map(
					usuario =>
						usuario.Usuarios && (
							<tr key={usuario.Usuarios.id} className="text-center">
								<td className="border-b border-neutral-700 pb-2">{fetchCompletadoCount(usuario.Usuarios.id)}</td>
								<td className="border-b border-neutral-700 pb-2">
									{usuario.Usuarios.nombre_completo}
								</td>
								<td className="border-b border-neutral-700 pb-2">{fetchTotalCount(usuario.Usuarios.id)}</td>
							</tr>
						),
				)}
			</tbody>
		</table>
	);
}
