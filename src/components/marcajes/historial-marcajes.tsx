import { getMarcajes } from "@/lib/marcajes/data-client";
import { Marcaje } from "@/lib/marcajes/types";
import { diferenciaTiempo } from "@/utils/time";
import { useCallback, useEffect, useState } from "react";

export default function HistorialMarcajes({ entrada }: { entrada: boolean }) {
	const [marcajes, setMarcajes] = useState<Marcaje[] | null>(null);
	const [filteredMarcajes, setFilteredMarcajes] = useState<Marcaje[] | null>(null);
	const [meses, setMeses] = useState<Record<string, string[]>>({});
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");

	// Cargar los marcajes
	async function fetchMarcajes() {
		const marcajes = await getMarcajes();
		setMarcajes(marcajes);
	}

	// Cargar los selects según los marcajes del usuario
	const loadSelects = useCallback(() => {
		if (!marcajes) return;

		const aniosConMeses: Record<string, Set<string>> = {};

		marcajes.forEach(marcaje => {
			const entradaDate = new Date(marcaje.entrada);
			const mes = entradaDate.toLocaleDateString("es-ES", { month: "long" });
			const anio = entradaDate.getFullYear().toString();

			if (!aniosConMeses[anio]) {
				aniosConMeses[anio] = new Set();
			}
			aniosConMeses[anio].add(mes);
		});

		const sortedAnios = Object.keys(aniosConMeses).sort((a, b) => parseInt(b) - parseInt(a));

		const formattedData = sortedAnios.reduce(
			(acc, anio) => {
				const sortedMeses = Array.from(aniosConMeses[anio]).sort((a, b) =>
					b.localeCompare(a),
				);
				acc[anio] = sortedMeses;
				return acc;
			},
			{} as Record<string, string[]>,
		);

		setMeses(formattedData);

		const firstAnio = sortedAnios[0];
		const firstMes = firstAnio
			? formattedData[firstAnio][formattedData[firstAnio].length - 1]
			: "";

		if (selectedMonth === "") setSelectedMonth(firstMes);
		if (selectedYear === "") setSelectedYear(firstAnio);
	}, [marcajes, selectedMonth, selectedYear]);

	// Filtrar los marcajes según el mes y el año del mes seleccionado
	const filterMarcajes = useCallback(() => {
		if (!marcajes) return;

		const filtered = marcajes.filter(marcaje => {
			const date = new Date(marcaje.entrada);
			const month = date.toLocaleDateString("es-ES", { month: "long" });
			const year = date.getFullYear().toString();

			const matchesMonth = selectedMonth ? month === selectedMonth : true;
			const matchesYear = selectedYear ? year === selectedYear : true;

			return matchesMonth && matchesYear;
		});

		setFilteredMarcajes(filtered);
	}, [marcajes, selectedMonth, selectedYear]);

	useEffect(() => {
		fetchMarcajes();
	}, [entrada]);

	useEffect(() => {
		loadSelects();
	}, [marcajes, loadSelects]);

	useEffect(() => {
		filterMarcajes();
	}, [selectedMonth, selectedYear, filterMarcajes]);

	function handleCambioAnio(anio: string) {
		setSelectedYear(anio);
		setSelectedMonth(meses[anio][0]);
	}

	function convertDate(date: string) {
		if (date) return new Date(date.replace(" ", "T")).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	}

	return (
		<div className="rounded-lg border border-neutral-700 bg-neutral-800 p-8">
			<div className="flex flex-row items-baseline justify-between">
				<h2 className="text-lg font-semibold">Historial de marcajes</h2>
				<div className="flex gap-2">
					<select
						className="rounded bg-neutral-700 p-2"
						value={selectedMonth}
						onChange={e => setSelectedMonth(e.target.value)}
					>
						{meses[selectedYear]?.map((mes, index) => (
							<option key={index} value={mes}>
								{String(mes).charAt(0).toUpperCase() + String(mes).slice(1)}
							</option>
						))}
					</select>
					<select
						className="rounded bg-neutral-700 p-2"
						value={selectedYear}
						onChange={e => handleCambioAnio(e.target.value)}
					>
						{Object.keys(meses).map((anio, index) => (
							<option key={index} value={anio}>
								{anio}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="mt-12 max-h-[600px] overflow-y-scroll">
				<table className="w-full min-w-[570px] table-fixed border-separate border-spacing-y-2 text-center">
					<tbody>
						<tr className="font-light text-neutral-400">
							<th className="border-b border-neutral-700 pb-2">Jornada</th>
							<th className="border-b border-neutral-700 pb-2">Entrada</th>
							<th className="border-b border-neutral-700 pb-2">Salida</th>
							<th className="border-b border-neutral-700 pb-2">Entrada</th>
							<th className="border-b border-neutral-700 pb-2">Salida</th>
							<th className="border-b border-neutral-700 pb-2">Horas</th>
						</tr>
						{filteredMarcajes?.map((marcaje, index) => (
							<tr key={index} className="font-mono">
								<td className="border-b border-neutral-700 pb-2">
									{new Date(marcaje.entrada).toLocaleDateString("es-ES")}
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{/* {marcaje.entrada.substring(11, 19)} */}
									{convertDate(marcaje.entrada)}
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{convertDate(marcaje.salida)}
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{convertDate(marcaje.entrada_2)}
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{convertDate(marcaje.salida_2)}
								</td>
								<td className="border-b border-neutral-700 pb-2">
									{diferenciaTiempo(marcaje)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{marcajes?.length === 0 && (
					<span className="block text-center text-neutral-400">
						No se han encontrado marcajes
					</span>
				)}
			</div>
		</div>
	);
}
