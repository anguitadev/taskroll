"use client";

import { addUsuarioToEntorno, addUsuarioToEquipo } from "@/lib/actions";
import { useState } from "react";

export default function NuevoUsuario({ equipoSlug, entornoSlug }: { equipoSlug?: string; entornoSlug?: string }) {
	const [nombreusuario, setNombreUsuario] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");

	async function handleNuevoUsuario() {
		let hasError = false;
		try {
			if (equipoSlug) await addUsuarioToEquipo(nombreusuario, equipoSlug);
			if (entornoSlug) await addUsuarioToEntorno(nombreusuario, entornoSlug);
		} catch (error) {
			hasError = true;
			if (error instanceof Error) setErrorMessage(error.message);
		} finally {
			if (!hasError) window.location.reload();
		}
	}

	return (
		<div
			id="nuevo-usuario"
			popover="auto"
			className="flex-col rounded border border-neutral-800 bg-neutral-950 p-6 backdrop:brightness-50 backdrop:backdrop-blur-sm"
		>
			<span className="mb-6 block text-lg font-semibold">Añadir nuevo usuario al {equipoSlug ? "equipo" : "entorno" }</span>
			<label>Introduce el nombre de usuario del nuevo miembro:</label>
			<div className="mt-4 flex w-full gap-2">
				<input
					type="text"
					placeholder="nombreusuario"
					className="grow rounded p-2"
					value={nombreusuario}
					onChange={e => setNombreUsuario(e.target.value)}
				></input>
				<button
					onClick={handleNuevoUsuario}
					className="w-fit rounded border border-indigo-700 bg-indigo-600 px-2 py-1"
				>
					Añadir
				</button>
			</div>
			{errorMessage && <span className="mt-2 block text-red-500">{errorMessage}</span>}
		</div>
	);
}
