"use client";
import { createClient } from "@/utils/supabase/client";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

interface User {
	nombre_usuario: string;
	nombre_completo: string;
	color: string;
	puesto: string | null;
	email: string | undefined;
}

export default function AjustesDelPerfil(usuario: User) {
	const supabase = createClient();

	const [loading, setLoading] = useState(true);
	const [color, setColor] = useState<string | null>(usuario.color);
	const [correoElectronico, setCorreoElectronico] = useState<string | null>(null);
	const [nombreCompleto, setNombreCompleto] = useState<string | null>(null);
	const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
	const [puesto, setPuesto] = useState<string | null>(null);

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const colorOptions = [
		"bg-red-600",
		"bg-orange-600",
		"bg-green-600",
		"bg-sky-600",
		"bg-indigo-600",
		"bg-pink-600",
	];

	const getUsuario = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase
				.from("Usuarios")
				.select(`nombre_completo, nombre_usuario, puesto, color`)
				.eq("nombre_usuario", usuario?.nombre_usuario)
				.single();

			if (error && status !== 406) {
				console.log(error);
				throw error;
			}

			if (data) {
				setCorreoElectronico(usuario.email!);
				setNombreCompleto(data.nombre_completo);
				setNombreUsuario(data.nombre_usuario);
				setPuesto(data.puesto);
				setColor(data.color);
			}
		} catch (error) {
			alert("Error cargando los datos de usuario.");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, [usuario, supabase]);

	useEffect(() => {
		getUsuario();
	}, [usuario, getUsuario]);

	async function updateUsuario({
		nombreCompleto,
		nombreUsuario,
		puesto,
		color,
	}: {
		nombreCompleto: string | null;
		nombreUsuario: string | null;
		puesto: string | null;
		color: string | null;
	}) {
		if (nombreCompleto == "") {
			setError("Por favor, introduce tu nombre.");
		} else {
			setError(null);
			try {
				setLoading(true);

				const { error } = await supabase
					.from("Usuarios")
					.update({
						nombre_completo: nombreCompleto,
						nombre_usuario: nombreUsuario,
						puesto: puesto,
						color: color,
					})
					.eq("nombre_usuario", usuario.nombre_usuario);
				if (error) throw error;
				setSuccess("Perfil actualizado correctamente.");
			} catch (error) {
				if (error) {
					setError("El nombre de usuario ya existe.");
				}
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
	}

	function handleDelete() {
		alert("delete");
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
				<div className="flex justify-between p-6">
					<span className="font-semibold">Correo Electrónico</span>
					<span>{correoElectronico}</span>
				</div>
				<div className="flex justify-between border-t border-neutral-800 p-6">
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
				<div className="flex justify-between border-t border-neutral-800 p-6">
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
				<div className="flex justify-between border-t border-neutral-800 p-6">
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
				onClick={() => updateUsuario({ nombreCompleto, nombreUsuario, puesto, color })}
				disabled={loading}
			>
				{loading ? "Cargando ..." : "Actualizar"}
			</button>
			<hr className="my-6 border-neutral-700" />
			<button
				className="w-full rounded border border-red-600 bg-red-600/5 py-3 font-semibold text-red-600"
				popoverTarget="pop"
			>
				Eliminar Cuenta
			</button>
			<div
				id="pop"
				popover="auto"
				className="w-[640px] flex-col rounded border border-neutral-800 bg-neutral-950 p-6 backdrop:brightness-50 backdrop:backdrop-blur-sm"
			>
				<div className="flex flex-col gap-4 text-center">
					<span className="text-lg font-semibold">
						¿Estás seguro que quieres eliminar tu cuenta?
					</span>
					<button className="rounded bg-red-600 p-2 text-neutral-200"
					onClick={handleDelete}
					disabled>
						Eliminar
					</button>
				</div>
			</div>
		</>
	);
}
