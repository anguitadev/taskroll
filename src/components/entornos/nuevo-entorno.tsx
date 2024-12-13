import { createEntorno } from "@/lib/actions";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NuevoEntorno({
	equipo,
}: {
	equipo: { id: string; nombre: string; slug: string; color: string };
}) {
	const [colorEntorno, setColorEntorno] = useState<string>("bg-indigo-600");
	const [nombreEntorno, setNombreEntorno] = useState<string>("");
	const [descripcionEntorno, setDescripcionEntorno] = useState<string>("");
	const [clientError, setClientError] = useState<string | null>(null);
	const [textoBoton, setTextoBoton] = useState<string>("Crear Entorno");

	const colorOptions = [
		"bg-red-600",
		"bg-orange-600",
		"bg-green-600",
		"bg-sky-600",
		"bg-indigo-600",
		"bg-pink-600",
	];

	const pathname = usePathname();

	// Ocultar popover
	useEffect(() => {
		document.getElementById("nuevo-entorno")?.hidePopover();
	}, [pathname]);

	// Crear nuevo entorno
	async function handleCreateEntorno() {
		setTextoBoton("Cargando...");
		if (!nombreEntorno) {
			setClientError("Por favor, añade un nombre al entorno.");
			return;
		}
		try {
			await createEntorno({ nombreEntorno, descripcionEntorno, colorEntorno, equipo });
		} catch (error) {
			console.log(error);
		}
		setTextoBoton("Crear Entorno");
		setNombreEntorno("");
	}

	return (
		<>
			<button popoverTarget="nuevo-entorno">
				<Plus className="flex items-center justify-center rounded bg-indigo-500 p-0.5" />
			</button>
			<div
				id="nuevo-entorno"
				popover="auto"
				className="w-[640px] rounded-lg border border-neutral-800 p-8 backdrop:brightness-50 backdrop:backdrop-blur-sm"
			>
				<span className="text-2xl font-semibold">Crear Nuevo Entorno</span>
				<div className="mt-6 rounded border border-neutral-800">
					<div className="flex flex-col gap-4 bg-neutral-800 p-6">
						<span className="font-semibold">Color del perfil</span>
						<div className="flex flex-row items-center justify-between">
							<span
								className={clsx(
									"flex size-16 items-center justify-center rounded p-6 text-4xl font-semibold",
									colorEntorno,
								)}
							>
								{nombreEntorno!.charAt(0).toUpperCase() || "A"}
							</span>
							<div className="flex flex-row gap-2">
								{colorOptions.map((color, index) => {
									return (
										<div
											key={index}
											className={clsx(
												"size-8 cursor-pointer rounded " + color,
												{
													"border-4 border-neutral-300":
														color === colorEntorno,
												},
											)}
											onClick={() => setColorEntorno(color)}
										/>
									);
								})}
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2 border-t border-neutral-800 p-6">
						<label htmlFor="nombreEquipo" className="font-semibold">
							Nombre del Entorno
						</label>
						<input
							id="nombreEquipo"
							className="rounded border border-neutral-800 px-2 py-1"
							type="text"
							value={nombreEntorno || ""}
							onChange={e => setNombreEntorno(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2 border-t border-neutral-800 p-6">
						<label htmlFor="nombreEquipo" className="font-semibold">
							Descripción <span className="font-regular text-sm">(Opcional)</span>
						</label>
						<input
							id="nombreEquipo"
							className="rounded border border-neutral-800 px-2 py-1"
							type="text"
							value={descripcionEntorno || ""}
							onChange={e => setDescripcionEntorno(e.target.value)}
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
