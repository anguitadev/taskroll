"use client";
import HistorialMarcajes from "@/components/marcajes/historial-marcajes";
import Incidencia from "@/components/marcajes/incidencia";
import { marcarEntrada, marcarSalida } from "@/lib/marcajes/actions";
import { getUltimoMarcaje } from "@/lib/marcajes/data-client";
import { useEffect, useState } from "react";
import Clock from "react-live-clock";

export default function Marcajes() {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const date = new Date();

	const [entrada, setEntrada] = useState(true);

	// Obtiene el último marcaje
	async function fetchData() {
		const ultimoMarcaje = await getUltimoMarcaje();

		if (ultimoMarcaje && ultimoMarcaje.length > 0) {
			const diaEntrada = new Date(ultimoMarcaje[0].entrada).getDay();
			const hoy = new Date().getDay();
			if (diaEntrada == hoy) {
				if (
					(ultimoMarcaje[0].entrada && !ultimoMarcaje[0].salida) ||
					(ultimoMarcaje[0].entrada_2 && !ultimoMarcaje[0].salida_2)
				) {
					setEntrada(false);
				}
			}
		}
	}

	useEffect(() => {
		fetchData();
	}, [entrada]);

	async function handleMarcaje() {
		if (entrada) {
			await marcarEntrada();
			await fetchData();
		} else {
			await marcarSalida();
			await fetchData();
		}
		setEntrada(!entrada);
	}

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Registro de Marcajes</span>
			</div>
			<div className="max-h-[calc(100vh-70px)] overflow-y-scroll p-3 md:pb-8 md:pt-16 xl:px-16">
				<h1 className="text-3xl font-bold">Registro de Marcajes</h1>
				<div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div className="rounded-lg border border-neutral-700 bg-neutral-800 p-8">
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
						<Incidencia />
					</div>
					<HistorialMarcajes entrada={entrada} />
				</div>
			</div>
		</>
	);
}
