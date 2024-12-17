"use client";
import { getUsuario } from "@/lib/auth/data-client";
import { getEntornosByEquipoSlug, getUsuariosFromEntorno } from "@/lib/entornos/data-client";
import { UsuariosEntorno } from "@/lib/entornos/types";
import { getProyectosByEntornoId } from "@/lib/proyectos/data-client";
import { createTarea } from "@/lib/tareas/actions";
import { Usuarios } from "@/lib/tareas/types";
import clsx from "clsx";
import { es } from "date-fns/locale/es";
import {
	BriefcaseBusiness,
	CalendarDays,
	Check,
	CirclePower,
	FlagTriangleRight,
	Rocket,
	Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar } from "../ui/calendar";

export default function NuevaTarea({ entorno }: { entorno: string }) {
	const estados: { [key: string]: string } = {
		Abierto: "bg-zinc-600",
		Progreso: "bg-sky-600",
		Revision: "bg-indigo-600",
		Completado: "bg-green-600",
	};

	const prioridades: { [key: string]: string } = {
		Ninguna: "stroke-neutral-400 fill-neutral-900 text-neutral-400",
		Baja: "stroke-neutral-400 fill-neutral-400 text-neutral-400",
		Normal: "stroke-blue-400 fill-blue-400 text-blue-400",
		Alta: "stroke-orange-400 fill-orange-400 text-orange-400",
		Urgente: "stroke-red-400 fill-red-400 text-red-400",
	};

	const [initial, setInitial] = useState(true);
	const [tituloTarea, setTituloTarea] = useState<string>("");
	const [estado, setEstado] = useState<string>("Abierto");
	const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
	const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
	const [usuariosEntorno, setUsuariosEntorno] = useState<UsuariosEntorno[]>([]);
	const [fechaFinal, setFechaFinal] = useState<Date | undefined>(new Date());
	const [prioridad, setPrioridad] = useState("Ninguna");
	const [clientError, setClientError] = useState<string | null>(null);
	const [textoBoton, setTextoBoton] = useState<string>("Crear Tarea");
	const [entornos, setEntornos] = useState<{ id: string; nombre: string }[] | null>([]);
	const [entornoSeleccionado, setEntornoSeleccionado] = useState<string>("");
	const [proyectos, setProyectos] = useState<{ id: string; nombre: string }[] | null>([]);
	const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string>(entorno);

	const pathname = usePathname();

	async function loadUsuario() {
		try {
			const data = await getUsuario();
			if (data && usuarios.length == 0) {
				setUsuarios([{ Usuarios: data }]);
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Cargar el usuario en la nueva tarea solo al cargar
	useEffect(() => {
		if (initial) loadUsuario();
		setInitial(false);
	}, [initial]);

	// Cerrar el popover al cambiar de página
	useEffect(() => {
		document.getElementById("nueva-tarea-" + entorno)?.hidePopover();
	}, [pathname]);

	// Cargar los usuarios del entorno
	useEffect(() => {
		if (mostrarUsuarios && entorno) {
			try {
				getUsuariosFromEntorno(proyectoSeleccionado).then(data => {
					if (data) setUsuariosEntorno(data);
				});
			} catch (error) {
				console.log(error);
			}
		}
	}, [mostrarUsuarios]);

	// Cargar los entornos del equipo
	useEffect(() => {
		async function fetchEntornos() {
			if (entorno.includes("equipo")) {
				const equipoSlug = entorno.split("-").pop();
				const entornosEquipo = await getEntornosByEquipoSlug(equipoSlug!);
				setEntornos(entornosEquipo!);
				if (entornosEquipo && entornosEquipo.length > 0) {
					setEntornoSeleccionado(entornosEquipo[0].id);
				}
			}
		}

		fetchEntornos();
	}, [entorno]);

	// Cargar los proyectos del entorno
	useEffect(() => {
		async function fetchProyectos() {
			if (entorno.includes("equipo") && entornoSeleccionado) {
				const proyectosEntorno = await getProyectosByEntornoId(entornoSeleccionado);
				setProyectos(proyectosEntorno!);
				if (proyectosEntorno && proyectosEntorno.length > 0) {
					setProyectoSeleccionado(proyectosEntorno[0].id);
				}
			}
		}

		fetchProyectos();
	}, [entornoSeleccionado]);

	async function handleCreateTarea() {
		setTextoBoton("Cargando...");

		//Comprobar los campos
		if (!tituloTarea || !estado || !prioridad || !fechaFinal || usuarios?.length === 0) {
			setClientError("Por favor, rellena los campos.");
			return;
		}

		// Si la tarea viene de un equipo
		if (entorno.includes("equipo")) {
			try {
				await createTarea(
					tituloTarea,
					estado,
					prioridad,
					fechaFinal.toDateString(),
					proyectoSeleccionado,
					usuarios,
				);
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				await createTarea(
					tituloTarea,
					estado,
					prioridad,
					fechaFinal.toDateString(),
					entorno,
					usuarios,
				);
			} catch (error) {
				console.log(error);
			}
		}

		setTextoBoton("Crear Tarea");
		window.location.reload();
	}

	// Función para cambiar el estado de la tarea
	function toggleEstadoCompletado() {
		if (estado === "Completado") {
			setEstado("Abierto");
		} else {
			setEstado("Completado");
		}
	}

	// Función para mostrar u ocultar los usuarios
	function toggleUsuarios() {
		setMostrarUsuarios(!mostrarUsuarios);
		document.getElementById("usuarios")?.classList.toggle("hidden");
	}

	// Función para mostrar u ocultar el calendario
	function toggleCalendario() {
		document.getElementById("calendario")?.classList.toggle("hidden");
	}

	// Función para añadir o quitar un usuario
	function addRemoveUsuario(idUsuario: string) {
		const usuario = usuariosEntorno.find(usuario => usuario.id === idUsuario);

		const inTarea = usuarios?.find(usuario => usuario.Usuarios?.id === idUsuario);

		if (inTarea) {
			setUsuarios(usuarios!.filter(item => item.Usuarios?.id !== idUsuario));
		} else {
			setUsuarios(usuarios!.concat([{ Usuarios: usuario! }]));
		}
	}

	return (
		<>
			<div
				id={"nueva-tarea-" + entorno}
				popover="auto"
				className="max-w-[calc(100vw-4%)] min-w-[900px] overflow-visible rounded-lg border border-neutral-800 p-2 md:p-8 backdrop:brightness-50 backdrop:backdrop-blur-sm"
			>
				<span className="text-2xl font-semibold">Crear Nueva Tarea</span>
				<div className="mt-6 w-full rounded border border-neutral-800">
					<div className="flex flex-col gap-4 p-6">
						<div className="flex flex-col gap-2">
							<label htmlFor="nombreTarea" className="font-semibold">
								Título de la Tarea
							</label>
							<input
								id="nombreTarea"
								className="rounded border border-neutral-800 px-2 py-1"
								type="text"
								value={tituloTarea || ""}
								onChange={e => setTituloTarea(e.target.value)}
							/>
						</div>
						<div className="my-8 grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-6">
							{entorno.includes("equipo") && entornos && entornos.length > 0 && (
								<div className="flex justify-between">
									<div className="flex items-center gap-2 text-neutral-400">
										<BriefcaseBusiness className="size-5" />{" "}
										<span>Entorno</span>
									</div>
									<div className="flex w-2/3 items-center gap-2">
										<select
											className="cursor-pointer appearance-none rounded px-2 py-1 transition hover:opacity-80"
											value={entornoSeleccionado}
											onChange={e => setEntornoSeleccionado(e.target.value)}
										>
											{entornos.map(entorno => (
												<option
													key={entorno.id}
													value={entorno.id}
													className="bg-neutral-900"
												>
													{entorno.nombre}
												</option>
											))}
										</select>
									</div>
								</div>
							)}
							{entorno.includes("equipo") && proyectos && proyectos.length > 0 && (
								<div className="flex justify-between">
									<div className="flex items-center gap-2 text-neutral-400">
										<BriefcaseBusiness className="size-5" />{" "}
										<span>Proyecto</span>
									</div>
									<div className="flex w-2/3 items-center gap-2">
										<select
											className="cursor-pointer appearance-none rounded px-2 py-1 transition hover:opacity-80"
											value={proyectoSeleccionado}
											onChange={e => setProyectoSeleccionado(e.target.value)}
										>
											{proyectos.map(proyecto => (
												<option
													key={proyecto.id}
													value={proyecto.id}
													className="bg-neutral-900"
												>
													{proyecto.nombre}
												</option>
											))}
										</select>
									</div>
								</div>
							)}

							<div className="flex justify-between">
								<div className="flex items-center gap-2 text-neutral-400">
									<CirclePower className="size-5" /> <span>Estado</span>
								</div>
								<div className="flex w-2/3 items-center gap-2">
									<select
										className={
											"cursor-pointer appearance-none rounded px-2 py-1 transition hover:opacity-80 " +
											estados[estado]
										}
										value={estado}
										onChange={e => setEstado(e.target.value)}
									>
										<option className="bg-neutral-900">Abierto</option>
										<option className="bg-neutral-900">Progreso</option>
										<option className="bg-neutral-900">Revision</option>
										<option className="bg-neutral-900">Completado</option>
									</select>
									<Check
										className={clsx(
											"size-8 cursor-pointer rounded p-2",
											estado === "Completado"
												? "bg-green-600"
												: "border border-neutral-500",
										)}
										onClick={toggleEstadoCompletado}
									/>
								</div>
							</div>

							<div className="flex justify-between">
								<div className="flex items-center gap-2 text-neutral-400">
									<Users className="size-5" /> <span>Usuarios</span>
								</div>
								<div
									className="relative flex w-2/3 cursor-pointer items-center pl-2"
									onClick={toggleUsuarios}
								>
									{usuarios &&
										usuarios.map(usuario => (
											<div
												key={usuario.Usuarios!.id}
												className={
													"-ml-2 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-900 text-center text-sm " +
													usuario.Usuarios!.color
												}
											>
												{usuario
													.Usuarios!.nombre_completo.slice(0, 1)
													.toUpperCase()}
											</div>
										))}

									<div
										className="absolute -left-2 top-12 hidden w-64 rounded border border-neutral-800 bg-neutral-900 p-1"
										id="usuarios"
									>
										{usuariosEntorno &&
											usuariosEntorno.map(usuario => (
												<div
													key={usuario.id}
													className={clsx(
														"flex cursor-pointer items-center gap-2 border-b border-neutral-800 px-2 py-1",
														usuarios?.find(
															user => user.Usuarios?.id == usuario.id,
														) && "bg-neutral-800",
													)}
													onClick={() => addRemoveUsuario(usuario.id)}
												>
													<div
														className={
															"flex size-7 items-center justify-center rounded-full border-2 border-neutral-900 text-center text-sm " +
															usuario.color
														}
													>
														{usuario.nombre_completo
															.slice(0, 1)
															.toUpperCase()}
													</div>
													<span>{usuario.nombre_completo}</span>
												</div>
											))}
									</div>
								</div>
							</div>

							<div className="flex justify-between">
								<div className="flex items-center gap-2 text-neutral-400">
									<CalendarDays className="size-5" /> <span>Fecha límite</span>
								</div>
								<div className="relative flex w-2/3 items-center">
									<span
										onClick={toggleCalendario}
										className={clsx(
											"cursor-pointer font-mono font-semibold",
											fechaFinal && fechaFinal <= new Date()
												? "text-red-400"
												: "text-green-400",
										)}
									>
										{fechaFinal?.toLocaleDateString("es-ES") ==
										new Date().toLocaleDateString("es-ES")
											? "Hoy"
											: fechaFinal?.toLocaleDateString("es-ES")}
									</span>
									<div id="calendario" className="absolute top-8 hidden">
										<Calendar
											weekStartsOn={1}
											locale={es}
											mode="single"
											selected={fechaFinal!}
											onSelect={setFechaFinal}
											className="rounded border border-neutral-800 bg-neutral-900"
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-between">
								<div className="flex items-center gap-2 text-neutral-400">
									<Rocket className="size-5" /> <span>Prioridad</span>
								</div>
								<div
									className={"flex w-2/3 items-center " + prioridades[prioridad]}
								>
									<FlagTriangleRight
										className={"size-5 " + prioridades[prioridad]}
									/>
									<select
										className="cursor-pointer appearance-none px-1"
										value={prioridad}
										onChange={e => setPrioridad(e.target.value)}
									>
										<option className="text-neutral-400">Ninguna</option>
										<option className="text-neutral-400">Baja</option>
										<option className="text-neutral-400">Normal</option>
										<option className="text-neutral-400">Alta</option>
										<option className="text-neutral-400">Urgente</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
				{clientError && <span className="mt-2 block text-red-500">{clientError}</span>}
				<button
					className="mt-4 w-full rounded bg-indigo-600 py-3 font-semibold"
					onClick={handleCreateTarea}
				>
					{textoBoton}
				</button>
			</div>
		</>
	);
}
