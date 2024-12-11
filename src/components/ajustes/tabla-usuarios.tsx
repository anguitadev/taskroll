import { Settings2 } from "lucide-react";
import AccionesUsuario from "./usuarios/acciones-usuario";
import NombreUsuario from "./usuarios/nombre-usuario";
import SelectRol from "./usuarios/select-rol";

export default function TablaUsuarios({
	usuarios,
	usuarioLoggeado,
}: {
	usuarios: {
		admin: boolean;
		equipo?: string;
		entorno?: string;
		Usuarios: {
			color: string;
			email: string;
			id: string;
			nombre_completo: string;
			nombre_usuario: string;
			puesto: string | null;
		} | null;
	}[];
	usuarioLoggeado: string;
}) {
	return (
		<table className="mt-8 w-full table-fixed border-separate border-spacing-y-2 overflow-y-scroll p-2 text-left">
			<tbody>
				<tr className="text-xs font-light text-neutral-400">
					<th className="border-b border-neutral-700 pb-2">Nombre</th>
					<th className="w-56 border-b border-neutral-700 pb-2">Usuario</th>
					<th className="w-64 border-b border-neutral-700 pb-2">Email</th>
					<th className="w-56 border-b border-neutral-700 pb-2">Puesto</th>
					<th className="w-28 border-b border-neutral-700 pb-2">Rol</th>
					<th className="w-12 border-b border-neutral-700 pb-2">
						<Settings2 className="m-auto size-4 stroke-neutral-400" />
					</th>
				</tr>
				{usuarios.map(
					usuario =>
						usuario.Usuarios && (
							<tr key={usuario.Usuarios.id}>
								<td className="border-b border-neutral-700 pb-2">
									<NombreUsuario usuario={usuario.Usuarios} />
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{usuario.Usuarios.nombre_usuario}
								</td>
								<td className="border-b border-neutral-700 pb-2 underline">
									<a href={`mailto:${usuario.Usuarios.email}`}>
										{usuario.Usuarios.email}
									</a>
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{usuario.Usuarios.puesto}
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{usuario.Usuarios.id !== usuarioLoggeado ? (
										<>
											{usuario.equipo && (
												<SelectRol
													admin={usuario.admin}
													usuarioId={usuario.Usuarios.id}
													equipoId={usuario.equipo}
												/>
											)}
											{usuario.entorno && (
												<SelectRol
													admin={usuario.admin}
													usuarioId={usuario.Usuarios.id}
													entornoId={usuario.entorno}
												/>
											)}
										</>
									) : usuario.admin ? (
										"Admin"
									) : (
										"Miembro"
									)}
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{usuario.Usuarios.id !== usuarioLoggeado && (
										<>
											{usuario.equipo && (
												<AccionesUsuario
													usuarioId={usuario.Usuarios.id}
													equipoId={usuario.equipo}
												/>
											)}
											{usuario.entorno && (
												<AccionesUsuario
													usuarioId={usuario.Usuarios.id}
													entornoId={usuario.entorno}
												/>
											)}
										</>
									)}
								</td>
							</tr>
						),
				)}
			</tbody>
		</table>
	);
}
