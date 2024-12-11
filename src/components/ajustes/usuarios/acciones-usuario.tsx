"use client";
import { removeUsuarioEquipo } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export default function AccionesUsuario({
	usuarioId,
	equipoId,
	entornoId,
}: {
	usuarioId: string;
	equipoId?: string;
	entornoId?: string;
}) {
	async function deleteUsuario(usuarioId: string) {
		if (equipoId) {
			await removeUsuarioEquipo(usuarioId, equipoId);
			window.location.reload();
		}
		if (entornoId) {
			await removeUsuarioEquipo(usuarioId, entornoId);
			window.location.reload();
		}
	}

	return (
		<div className="flex justify-center gap-2">
			<div title="Eliminar usuario del equipo" onClick={() => deleteUsuario(usuarioId)}>
				<Trash2 className="size-4 cursor-pointer stroke-neutral-400 transition hover:stroke-red-500" />
			</div>
		</div>
	);
}
