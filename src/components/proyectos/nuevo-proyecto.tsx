import { createProyecto } from "@/lib/actions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NuevoProyecto({ entorno }: { entorno: string | null }) {
	const [nombreProyecto, setNombreProyecto] = useState<string>("");
	const [clientError, setClientError] = useState<string | null>(null);
	const [textoBoton, setTextoBoton] = useState<string>("Crear Proyecto");

	const pathname = usePathname();

	useEffect(() => {
		document.getElementById("nuevo-proyecto")?.hidePopover();
	}, [pathname]);

	async function handleCreateEntorno() {
		setTextoBoton("Cargando...");
		if (!nombreProyecto) {
			setClientError("Por favor, añade un nombre al proyecto.");
			return;
		}
		try {
			await createProyecto(nombreProyecto, entorno!);
		} catch (error) {
			console.log(error);
		}
		setTextoBoton("Crear Proyecto");
		setNombreProyecto("");
	}

	return (
		<>
			<div
				id="nuevo-proyecto"
				popover="auto"
				className="w-[640px] rounded-lg border border-neutral-800 p-8 backdrop:brightness-50 backdrop:backdrop-blur-sm"
			>
				<span className="text-2xl font-semibold">Crear Nuevo Proyecto</span>
				<div className="mt-6 rounded border border-neutral-800">
					<div className="flex flex-col gap-2 p-6">
						<label htmlFor="nombreEquipo" className="font-semibold">
							Nombre del Proyecto
						</label>
						<input
							id="nombreEquipo"
							className="rounded border border-neutral-800 px-2 py-1"
							type="text"
							value={nombreProyecto || ""}
							onChange={e => setNombreProyecto(e.target.value)}
						/>
					</div>
				</div>
				{clientError && <span className="mt-2 block text-red-500">{clientError}</span>}
				<button
					className="mt-4 w-full rounded bg-indigo-600 py-3 font-semibold"
					onClick={handleCreateEntorno}
				>
					{textoBoton}
				</button>
			</div>
		</>
	);
}
