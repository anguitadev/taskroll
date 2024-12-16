"use client";
import { Tables } from "@/db.types";
import { deleteIncidenciaById } from "@/lib/marcajes/actions";
import { getIncidenciasByUsuarioId, getMarcajesByUsuarioId } from "@/lib/marcajes/data-client";
import { diferenciaTiempo } from "@/utils/time";
import { Download, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface Marcaje {
	entrada: string;
	salida: string;
	entrada_2: string;
	salida_2: string;
}

export default function TablaMarcajes({
	usuarioId,
	nombreUsuario,
}: {
	usuarioId: string;
	nombreUsuario: string;
}) {
	const [marcajes, setMarcajes] = useState<Marcaje[] | null>(null);
	const [filteredMarcajes, setFilteredMarcajes] = useState<Marcaje[] | null>(null);
	const [meses, setMeses] = useState<Record<string, string[]>>({});
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [incidencias, setIncidencias] = useState<Tables<"Incidencias">[] | null>(null);
	const [showIncidencias, setShowIncidencias] = useState(false);

	async function fetchMarcajes() {
		try {
			await getMarcajesByUsuarioId(usuarioId).then(data => {
				setMarcajes(data);
			});
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async function fetchIncidencias() {
		try {
			await getIncidenciasByUsuarioId(usuarioId).then(data => {
				setIncidencias(data);
			});
		} catch (error) {
			console.error("Error:", error);
		}
	}

	function downloadExcel() {
		if (!filteredMarcajes) return;
		const worksheet = XLSX.utils.json_to_sheet(filteredMarcajes);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, `marcajes-${nombreUsuario}.xlsx`);
	}

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
		fetchIncidencias();
	}, [usuarioId, showIncidencias]);

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

	async function deleteIncidencia(incidenciaId: string) {
		try {
			await deleteIncidenciaById(incidenciaId);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			if (!Error) {
				window.location.reload();
			}
		}
	}

	return (
		<div className="w-fit rounded-lg border border-neutral-800 bg-neutral-900 p-8">
			<div className="flex flex-row items-baseline justify-between">
				<h2 className="text-lg font-semibold">Historial de marcajes</h2>
				{!showIncidencias && (
					<div className="flex items-center gap-2">
						{incidencias && incidencias.length > 0 && (
							<span
								className="cursor-pointer font-semibold text-neutral-400"
								onClick={() => setShowIncidencias(true)}
							>
								Ver Incidencias
							</span>
						)}
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
				)}
			</div>
			{!showIncidencias ? (
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
										{marcaje.entrada.substring(11, 19)}
									</td>
									<td className="border-b border-neutral-700 pb-2">
										{marcaje.salida?.substring(11, 19)}
									</td>
									<td className="border-b border-neutral-700 pb-2">
										{marcaje.entrada_2?.substring(11, 19)}
									</td>
									<td className="border-b border-neutral-700 pb-2">
										{marcaje.salida_2?.substring(11, 19)}
									</td>
									<td className="border-b border-neutral-700 pb-2">
										{diferenciaTiempo(marcaje)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{marcajes?.length === 0 ? (
						<span className="block text-center text-neutral-400">
							No se han encontrado marcajes
						</span>
					) : (
						<button
							onClick={downloadExcel}
							className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-indigo-700 bg-indigo-600 p-2 text-sm font-medium"
						>
							<Download className="size-5" />
							Descargar Excel
						</button>
					)}
				</div>
			) : (
				<div className="w-[634px] flex-col rounded py-6 backdrop:brightness-50 backdrop:backdrop-blur-sm">
					<span className="mb-6 block text-lg font-semibold">
						Estas son las últimas incidencias:
					</span>
					<div className="overflow-y-scroll">
						{incidencias &&
							incidencias.map((incidencia, index) => (
								<div
									className="flex flex-col border-b border-neutral-800 p-2"
									key={index}
								>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm font-semibold text-neutral-400">
											{new Date(incidencia.creado).toLocaleDateString(
												"es-ES",
											)}
										</span>
										<Trash2
											className="size-5 cursor-pointer stroke-neutral-400 transition hover:stroke-red-600"
											onClick={() => deleteIncidencia(incidencia.id)}
										/>
									</div>
									<span>{incidencia.comentario}</span>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
}
