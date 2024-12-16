"use client";
import { Tables } from "@/db.types";
import { deleteEntornoById, updateEntornoById } from "@/lib/entornos/actions";
import { Entorno } from "@/lib/entornos/types";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DatosEntorno({
	entorno,
	propietario,
	isAdmin,
}: {
	entorno: Entorno;
	propietario: Tables<"Usuarios">;
	isAdmin: boolean;
}) {
	const [nombre, setNombre] = useState(entorno?.nombre);
	const [descripcion, setDescripcion] = useState(entorno?.descripcion);
	const [clientError, setClientError] = useState<string | null>(null);

	const pathname = usePathname();

	async function handleUpdate() {
		if (nombre === "") {
			setClientError("El nombre del entorno no puede estar vacío.");
			return;
		}
		try {
			await updateEntornoById(entorno.id, nombre, descripcion ?? "");
		} catch (error) {
			if (error instanceof Error) setClientError(error.message);
		} finally {
			window.location.reload();
		}
	}

	async function handleDelete() {
		try {
			await deleteEntornoById(entorno.id);
		} catch (error) {
			if (error instanceof Error) setClientError(error.message);
		} finally {
			window.location.href = pathname.substring(0, pathname.lastIndexOf("/"));
		}
	}

	if (entorno)
		return (
			<>
				<div className="grid grid-cols-2 grid-rows-2 gap-4">
					<div className="flex flex-col gap-2">
						<label className="font-medium text-neutral-400">Nombre:</label>
						<input
							className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
							type="text"
							value={nombre}
							onChange={e => setNombre(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<span className="font-medium text-neutral-400">Propietario:</span>
						<div className="flex items-center gap-2 px-2 py-1 font-semibold">
							<div
								className={
									"flex size-6 items-center justify-center rounded-full text-sm " +
									propietario.color
								}
							>
								{propietario.nombre_completo[0]}
							</div>
							{propietario.nombre_completo}
						</div>
					</div>

					<div className="col-span-2 flex flex-col gap-2">
						<label className="font-medium text-neutral-400">
							Descripción: <span className="text-sm">(Opcional)</span>
						</label>
						<input
							className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
							type="text"
							value={descripcion || ""}
							onChange={e => setDescripcion(e.target.value)}
						/>
					</div>
				</div>
				{clientError && <p className="mt-2 text-red-500">{clientError}</p>}
				<div className="flex gap-2">
					<button
						className={clsx("mt-4 rounded border border-indigo-500 bg-indigo-600 p-1 font-medium", isAdmin && " w-1/2")}
						onClick={handleUpdate}
					>
						Actualizar
					</button>
					{isAdmin &&<button
						className="mt-4 rounded border border-red-500 bg-red-600 p-1 font-medium w-1/2"
						onClick={handleDelete}
					>
						Eliminar
					</button>}
				</div>
			</>
		);
}
