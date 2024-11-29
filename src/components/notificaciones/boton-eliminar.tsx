"use client";

import { removeNotificacion } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export default function BotonEliminar({ idNotificacion }: { idNotificacion: string }) {
	async function handleEliminarNotificacion(notificacionId: string) {
		try {
			await removeNotificacion(notificacionId);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<button
				onClick={() => handleEliminarNotificacion(idNotificacion)}
				className="z-50 gap-2 items-center hidden rounded border border-indigo-500 bg-indigo-600 px-2 py-1 text-neutral-100 group-hover:flex"
			>
				<Trash2 className="size-4" /> Eliminar
			</button>
		</>
	);
}
