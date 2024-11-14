import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function Incidencia() {
	const supabase = createClient();

	const [comentario, setComentarios] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

	async function crearIncidencia() {
		if (comentario == "") {
            setSuccess(null);
			setError("Por favor, introduce tu incidencia.");
		} else {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			await supabase.from("Incidencias").insert({
				comentario: comentario,
				usuario: user!.id,
			});

            setError(null);
            setSuccess("Incidencia creada correctamente.");
            setComentarios("");
		}
	}

	return (
		<div className="mt-24">
			<h2 className="text-lg font-semibold">Crear nueva incidencia</h2>
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
		</div>
	);
}
