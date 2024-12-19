"use client";

import { Tables } from "@/db.types";
import { deleteEquipo, updateEquipo } from "@/lib/equipos/actions";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AjustesDelEquipo(equipo: Tables<"Equipos">) {
	const colorOptions = [
		"bg-red-600",
		"bg-orange-600",
		"bg-green-600",
		"bg-sky-600",
		"bg-indigo-600",
		"bg-pink-600",
	];

	const [colorEquipo, setColorEquipo] = useState<string>(equipo.color);
	const [nombreEquipo, setNombreEquipo] = useState<string>(equipo.nombre);
	const [slugEquipo, setSlugEquipo] = useState<string>(equipo.slug);

	const [success, setSuccess] = useState<string | null>(null);
	const [clientError, setClientError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams?.get("success")) setSuccess("Equipo actualizado correctamente.");
		if (searchParams?.get("error")) setClientError("La URL del equipo ya existe.");
	}, [pathname, searchParams]);

	async function handleUpdate() {
		if (nombreEquipo == "" || slugEquipo === "") {
			setClientError("Los campos no pueden estar vacíos.");
		} else {
			try {
				setLoading(true);
				await updateEquipo({
					idEquipo: equipo.id,
					nombreEquipo,
					slugEquipo,
					colorEquipo,
				});
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
	}

	async function handleDelete() {
		try {
			await deleteEquipo(equipo.id);
		} catch (error) {
			if (error instanceof Error) setClientError(error.message);
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
								colorEquipo,
							)}
						>
							{nombreEquipo.charAt(0).toUpperCase()}
						</span>
						<div className="flex flex-row gap-2">
							{colorOptions.map((color, index) => {
								return (
									<div
										key={index}
										className={clsx("size-8 cursor-pointer rounded " + color, {
											"border-4 border-neutral-300": color === colorEquipo,
										})}
										onClick={() => setColorEquipo(color)}
									/>
								);
							})}
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-between gap-2 p-6 md:flex-row">
					<label htmlFor="nombreEquipo" className="font-semibold">
						Nombre del Equipo
					</label>
					<input
						id="nombreEquipo"
						className="rounded border border-neutral-800 px-2 py-1"
						type="text"
						value={nombreEquipo || ""}
						onChange={e => setNombreEquipo(e.target.value)}
					/>
				</div>
				<div className="flex flex-col justify-between border-t border-neutral-800 p-6 md:flex-row">
					<label htmlFor="slugEquipo" className="font-semibold">
						URL del Equipo
					</label>
					<div className="flex items-center gap-1">
						<span>taskroll.app/</span>
						<input
							id="slugEquipo"
							className="w-full rounded border border-neutral-800 px-2 py-1"
							type="text"
							value={slugEquipo || ""}
							onChange={e => setSlugEquipo(e.target.value)}
						/>
					</div>
				</div>
			</div>
			{success && <span className="mt-2 block text-green-500">{success}</span>}
			{clientError && <span className="mt-2 block text-red-500">{clientError}</span>}
			<button
				className="mt-4 w-full rounded bg-indigo-600 py-3 font-semibold"
				onClick={handleUpdate}
				disabled={loading}
			>
				{loading ? "Cargando ..." : "Actualizar"}
			</button>
			<hr className="my-6 border-neutral-700" />
			<button
				className="w-full rounded border border-red-600 bg-red-600/5 py-3 font-semibold text-red-600"
				popoverTarget="pop"
			>
				Eliminar Equipo
			</button>
			<div
				id="pop"
				popover="auto"
				className="max-w-[calc(100vw-4%)] w-[640px] flex-col rounded border border-neutral-800 bg-neutral-950 p-2 md:p-6 backdrop:brightness-50 backdrop:backdrop-blur-sm"
			>
				<div className="flex flex-col gap-4 text-center">
					<span className="text-lg font-semibold">
						¿Estás seguro que quieres eliminar el equipo?
					</span>
					<button
						className="rounded bg-red-600 p-2 text-neutral-200"
						onClick={handleDelete}
					>
						Eliminar
					</button>
				</div>
			</div>
		</>
	);
}
