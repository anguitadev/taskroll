"use client";
import HistorialMarcajes from "@/components/marcajes/historial-marcajes";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import Clock from "react-live-clock";

export default function Marcajes() {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const date = new Date();

	const supabase = createClient();

	const [entrada, setEntrada] = useState(true);

	const getUltimoMarcaje = useCallback(async () => {
		const { data } = await supabase
			.from("Marcajes")
			.select("id, entrada, salida, entrada_2, salida_2")
			.or("salida.is.null,salida_2.is.null")
			.order("entrada", { ascending: false })
			.limit(1);

		if (data && data.length > 0) {
			if ((data[0].entrada && !data[0].salida) || (data[0].entrada_2 && !data[0].salida_2)) {
				setEntrada(false);
			}
		}
		return data;
	}, [supabase]);

	useEffect(() => {
		getUltimoMarcaje();
	}, [getUltimoMarcaje]);

	async function marcarEntrada() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const ultimoMarcaje = await getUltimoMarcaje();

		if (ultimoMarcaje && ultimoMarcaje.length > 0) {
			if (ultimoMarcaje[0].salida) {
				await supabase
					.from("Marcajes")
					.update({
						entrada_2: new Date().toISOString(),
					})
					.eq("id", ultimoMarcaje[0].id);
			}
		} else {
			await supabase.from("Marcajes").insert({
				usuario: user!.id,
				entrada: new Date().toISOString(),
			});
		}
	}

	async function marcarSalida() {
		const ultimoMarcaje = await getUltimoMarcaje();

		if (ultimoMarcaje && ultimoMarcaje.length > 0) {
			if (!ultimoMarcaje[0].salida) {
				await supabase
					.from("Marcajes")
					.update({
						salida: new Date().toISOString(),
					})
					.eq("id", ultimoMarcaje[0].id);
			} else if (!ultimoMarcaje[0].salida_2) {
				await supabase
					.from("Marcajes")
					.update({
						salida_2: new Date().toISOString(),
					})
					.eq("id", ultimoMarcaje[0].id);
			}
		}
	}

	async function handleMarcaje() {
		if (entrada) {
			await marcarEntrada();
		} else {
			await marcarSalida();
		}
		setEntrada(!entrada);
	}

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Registro de Marcajes</span>
			</div>
			<div className="px-16 pt-16">
				<h1 className="text-3xl font-bold">Registro de Marcajes</h1>
				<div className="mt-8 flex gap-4">
					<div className="w-1/2 rounded-lg border border-neutral-700 bg-neutral-800 p-8">
						<div>
							<h2 className="text-lg font-semibold">Realizar nuevo marcaje</h2>
							<span className="mt-12 block text-center font-mono text-5xl font-semibold">
								<Clock format={"HH:mm:ss"} ticking={true} timezone={tz} />
							</span>
							<span className="mt-4 block text-center text-lg font-medium">
								{date.toLocaleDateString("es-ES")} - Hora Local: {tz}
							</span>
							<button
								className="mt-8 w-full rounded border border-indigo-600 bg-indigo-500 py-5 text-center text-xl font-bold uppercase"
								onClick={handleMarcaje}
							>
								Marcar {entrada ? "Entrada" : "Salida"}
							</button>
						</div>
						<div className="mt-24">
							<h2 className="text-lg font-semibold">Crear nueva incidencia</h2>
							<form>
								<textarea
									placeholder="Escribe el mensaje de tu incidencia..."
									className="mt-9 h-36 w-full rounded p-4 py-2"
								/>

								<button className="mt-4 w-full rounded bg-neutral-700 py-4 text-center font-semibold uppercase text-neutral-300">
									Crear Incidencia
								</button>
							</form>
						</div>
					</div>
					<HistorialMarcajes entrada={entrada} />
				</div>
			</div>
		</>
	);
}
