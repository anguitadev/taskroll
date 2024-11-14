import { createClient } from "@/utils/supabase/client";
import { diferenciaTiempo } from "@/utils/time";
import { useCallback, useEffect, useState } from "react";

interface Marcaje {
	entrada: string;
	salida: string;
	entrada_2: string;
	salida_2: string;
}

export default function HistorialMarcajes({ entrada }: { entrada: boolean }) {
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

	const mesesAnteriores = meses.slice(0, new Date().getMonth() + 1).reverse();

	// PONER SIMPLEMENTE LOS MESES Y AÑOS DE LOS QUE HAYAN ARCHIVOS

	const [marcajes, setMarcajes] = useState<Marcaje[] | null>(null);
	const supabase = createClient();

	const getMarcajes = useCallback(async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { data } = await supabase
			.from("Marcajes")
			.select("entrada, salida, entrada_2, salida_2")
			.eq("usuario", user!.id)
			.order("entrada", { ascending: false });

		setMarcajes(data);
	}, [supabase]);

	useEffect(() => {
		getMarcajes();
	}, [entrada, getMarcajes]);

	return (
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
							<th className="border-b border-neutral-700 pb-2">Jornada</th>
							<th className="border-b border-neutral-700 pb-2">Entrada</th>
							<th className="border-b border-neutral-700 pb-2">Salida</th>
							<th className="border-b border-neutral-700 pb-2">Entrada</th>
							<th className="border-b border-neutral-700 pb-2">Salida</th>
							<th className="border-b border-neutral-700 pb-2">Horas</th>
							<th className="border-b border-neutral-700 pb-2"></th>
						</tr>
						{marcajes?.map((marcaje, index) => (
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
				{marcajes?.length === 0 && (
					<span className="block text-center text-neutral-400">
						No se han encontrado marcajes
					</span>
				)}
			</div>
		</div>
	);
}
