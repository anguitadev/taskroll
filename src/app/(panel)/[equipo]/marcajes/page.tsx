"use client";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import Clock from "react-live-clock";
import { marcarEntrada } from "./actions";

export default function Marcajes() {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const date = new Date();

	const meses = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Jumio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];

	const anios = ["2024", "2023", "2022", "2021", "2020"];

	const mesesAnteriores = meses.slice(0, date.getMonth() + 1).reverse();

	// PONER SIMPLEMENTE LOS MESES Y AÑOS DE LOS QUE HAYAN ARCHIVOS

	const [entrada, setEntrada] = useState(true);

	function handleEntrada() {
		setEntrada(!entrada);
		if (entrada) {
			marcarEntrada();
		} else {
			marcarEntrada();
		}
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
								onClick={handleEntrada}
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
					<div className="w-1/2 rounded-lg border border-neutral-700 bg-neutral-800 p-8">
						<div className="flex flex-row items-baseline justify-between">
							<h2 className="text-lg font-semibold">Historial de marcajes</h2>
							<div className="flex gap-2">
								<select className="rounded bg-neutral-700 p-2">
									{mesesAnteriores.map((mes, index) => (
										<option key={index} value={mes}>
											{mes}
										</option>
									))}
								</select>
								<select className="rounded bg-neutral-700 p-2">
									{anios.map((anio, index) => (
										<option key={index} value={anio}>
											{anio}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="mt-12 max-h-[600px] overflow-y-scroll">
							<table className="w-full border-separate border-spacing-y-2 text-center">
								<tbody>
									<tr className="font-light text-neutral-400">
										<th className="border-b border-neutral-700 pb-2">
											Jornada
										</th>
										<th className="border-b border-neutral-700 pb-2">
											Entrada
										</th>
										<th className="border-b border-neutral-700 pb-2">Salida</th>
										<th className="border-b border-neutral-700 pb-2">
											Entrada
										</th>
										<th className="border-b border-neutral-700 pb-2">Salida</th>
										<th className="border-b border-neutral-700 pb-2">Horas</th>
										<th className="border-b border-neutral-700 pb-2"></th>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
									<tr className="font-mono">
										<td className="border-b border-neutral-700 pb-2">
											23/10/2024
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:00:23
										</td>
										<td className="border-b border-neutral-700 pb-2">
											13:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											15:00:13
										</td>
										<td className="border-b border-neutral-700 pb-2">
											17:04:27
										</td>
										<td className="border-b border-neutral-700 pb-2">
											08:04:04
										</td>
										<td className="border-b border-neutral-700 pb-2">
											<Ellipsis className="size-5 stroke-neutral-400" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
