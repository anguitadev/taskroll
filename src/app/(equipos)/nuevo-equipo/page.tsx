"use client";
import { getUsuario } from "@/lib/auth/data-client";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import nuevoEquipo from "./actions";

export default function NuevoEquipo() {
	const [nombreEquipo, setNombreEquipo] = useState("");
    const searchParams = useSearchParams();
	const clientError = searchParams.get("error");

	async function checkUsuario() {
		const usuario = await getUsuario();
		if (!usuario) return redirect("/login");
	}
	checkUsuario();

	return (
		<div className="m-auto flex w-[500px] flex-col items-center pt-32 font-sans">
			<div className="text-center">
				<h1 className="my-8 text-3xl font-semibold">¡Bienvenido a Taskroll!</h1>
				<div className="flex flex-col gap-2 text-xl text-neutral-400">
					<p>Parece que no tienes ningún equipo asignado...</p>
					<p>¿Quieres crear uno nuevo?</p>
				</div>
			</div>
			<div className="mt-6 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-6">
				<form className="flex flex-col gap-3">
					<label htmlFor="email">Nombre del Equipo</label>
					<input
						className="rounded border border-neutral-800 bg-transparent px-4 py-2"
						id="nombreEquipo"
						name="nombreEquipo"
						type="text"
						placeholder="Equipo 1"
						value={nombreEquipo}
						onChange={e => setNombreEquipo(e.target.value)}
						autoComplete="email"
						required
					/>
					<button
						formAction={nuevoEquipo}
						className="mt-4 rounded border border-indigo-600 bg-indigo-500 px-4 py-2 font-medium"
					>
						Crear Equipo
					</button>
				</form>
                {clientError && <p className="text-red-500">Ha habido un error al crear el equipo.</p>}
			</div>
		</div>
	);
}
