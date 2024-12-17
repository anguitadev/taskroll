"use client";
import { updateUsuario } from "@/lib/auth/actions";
import clsx from "clsx";
import { useState } from "react";

interface User {
	color: string;
	email: string;
	id: string;
	nombre_completo: string;
	nombre_usuario: string;
	puesto: string | null;
}

export default function AjustesDelPerfil({ usuario }: { usuario: User }) {
	const colorOptions = [
		"bg-red-600",
		"bg-orange-600",
		"bg-green-600",
		"bg-sky-600",
		"bg-indigo-600",
		"bg-pink-600",
	];

	const [loading, setLoading] = useState(false);
	const [color, setColor] = useState<string>(usuario.color);
	const [nombreCompleto, setNombreCompleto] = useState<string>(usuario.nombre_completo);
	const [nombreUsuario, setNombreUsuario] = useState<string>(usuario.nombre_usuario);
	const [puesto, setPuesto] = useState<string | null>(usuario.puesto);

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleUpdate() {
		if (nombreCompleto == "") {
			setError("Por favor, introduce tu nombre.");
		} else {
			setError(null);
			try {
				setLoading(true);
				await updateUsuario(nombreCompleto, nombreUsuario, color, puesto);
			} catch (error) {
				if (error instanceof Error) setError(error.message);
			} finally {
				setLoading(false);
				setSuccess("Perfil actualizado correctamente.");
			}
		}
	}

	return (
		<>
			<div className="mt-2 rounded border border-neutral-800">
				<div className="flex flex-col gap-4 bg-neutral-800 p-6">
					<span className="font-semibold">Color del perfil</span>
					<div className="flex flex-row items-center justify-between">
						<span
							className={clsx(
								"flex size-16 items-center justify-center rounded p-6 text-4xl font-semibold",
								color,
							)}
						>
							{nombreCompleto?.charAt(0).toUpperCase()}
						</span>
						<div className="flex flex-row gap-2">
							{colorOptions.map((option, index) => {
								return (
									<div
										key={index}
										className={clsx("size-8 cursor-pointer rounded " + option, {
											"border-4 border-neutral-300": option === color,
										})}
										onClick={() => setColor(option)}
									/>
								);
							})}
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-between gap-2 p-6 md:flex-row">
					<span className="font-semibold">Correo Electrónico</span>
					<span>{usuario.email}</span>
				</div>
				<div className="flex flex-col justify-between gap-2 border-t border-neutral-800 p-6 md:flex-row">
					<label htmlFor="nombreCompleto" className="font-semibold">
						Nombre Completo
					</label>
					<input
						id="nombreCompleto"
						className="rounded border border-neutral-800 px-2 py-1"
						type="text"
						value={nombreCompleto || ""}
						onChange={e => setNombreCompleto(e.target.value)}
					/>
				</div>
				<div className="flex flex-col justify-between gap-2 border-t border-neutral-800 p-6 md:flex-row">
					<label htmlFor="nombreUsuario" className="font-semibold">
						Nombre de Usuario
					</label>
					<input
						id="nombreUsuario"
						className="rounded border border-neutral-800 px-2 py-1"
						type="text"
						value={nombreUsuario || ""}
						onChange={e => setNombreUsuario(e.target.value)}
					/>
				</div>
				<div className="flex flex-col justify-between gap-2 border-t border-neutral-800 p-6 md:flex-row">
					<label htmlFor="puesto" className="font-semibold">
						Puesto
					</label>
					<input
						id="puesto"
						className="rounded border border-neutral-800 px-2 py-1"
						type="text"
						value={puesto || ""}
						onChange={e => setPuesto(e.target.value)}
					/>
				</div>
			</div>
			{success && <span className="mt-2 block text-green-500">{success}</span>}
			{error && <span className="mt-2 block text-red-500">{error}</span>}
			<button
				className="mt-4 w-full rounded bg-indigo-600 py-3 font-semibold"
				onClick={handleUpdate}
				disabled={loading}
			>
				{loading ? "Cargando ..." : "Actualizar"}
			</button>
		</>
	);
}
