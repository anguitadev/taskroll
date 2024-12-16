import { Tables } from "@/db.types";
import { getUsuario } from "@/lib/auth/data-client";
import { getIncidencias } from "@/lib/marcajes/data-client";
import { createClient } from "@/utils/supabase/client";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Incidencia() {
	const supabase = createClient();

	const [comentario, setComentarios] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [incidencias, setIncidencias] = useState<Tables<"Incidencias">[] | null>(null);

	async function fetchIncidencias() {
		const incidencias = await getIncidencias();
		setIncidencias(incidencias?.length ? incidencias : null);
	}

	async function crearIncidencia() {
		if (comentario == "") {
			setSuccess(null);
			setError("Por favor, introduce tu incidencia.");
		} else {
			const usuario = await getUsuario();

			await supabase.from("Incidencias").insert({
				comentario: comentario,
				usuario: usuario.id,
			});

			setError(null);
			setSuccess("Incidencia creada correctamente.");
			setComentarios("");
		}
	}

	useEffect(() => {
		fetchIncidencias();
	}, [crearIncidencia]);

	async function deleteIncidencia(id: string) {
		const { error } = await supabase.from("Incidencias").delete().eq("id", id);
		if (!error) {
			await fetchIncidencias();
		}
	}

	return (
		<div className="mt-24">
			<div className="flex justify-between">
				<h2 className="text-lg font-semibold">Crear nueva incidencia</h2>
				{incidencias && (
					<button
						popoverTarget="incidencias"
						className="cursor-pointer text-sm text-neutral-400"
					>
						Ver las incidencias
					</button>
				)}
			</div>
			<textarea
				placeholder="Escribe el mensaje de tu incidencia..."
				className="mt-9 h-36 w-full rounded p-4 py-2"
				value={comentario}
				onChange={e => setComentarios(e.target.value)}
			/>
			{error && <p className="text-red-500">{error}</p>}
			{success && <p className="text-green-500">{success}</p>}
			<button
				className="mt-4 w-full rounded bg-neutral-700 py-4 text-center font-semibold uppercase text-neutral-300"
				onClick={crearIncidencia}
			>
				Crear Incidencia
			</button>
			{incidencias && (
				<div
					id="incidencias"
					popover="auto"
					className="w-[640px] flex-col rounded border border-neutral-800 bg-neutral-950 p-6 backdrop:brightness-50 backdrop:backdrop-blur-sm"
				>
					<span className="mb-6 block text-lg font-semibold">
						Estas son tus últimas incidencias:
					</span>
					<div className="max-h-[600px] overflow-y-scroll">
						{incidencias.map((incidencia, index) => (
							<div
								className="flex flex-col border-b border-neutral-800 p-2"
								key={index}
							>
								<div className="mb-2 flex items-center justify-between">
									<span className="text-sm font-semibold text-neutral-400">
										{new Date(incidencia.creado).toLocaleDateString("es-ES")}
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
