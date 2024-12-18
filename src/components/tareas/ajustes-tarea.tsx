"use client";

import { Calendar } from "@/components/ui/calendar";
import { getUsuariosFromEntorno } from "@/lib/entornos/data-client";
import { UsuariosEntorno } from "@/lib/entornos/types";
import {
	cambiarEstadoTarea,
	cambiarFechaFinal,
	cambiarPrioridadTarea,
	cambiarUsuariosTarea,
} from "@/lib/tareas/actions";
import { UsuariosTareas } from "@/lib/tareas/types";
import clsx from "clsx";
import { es } from "date-fns/locale/es";
import { CalendarDays, Check, CirclePower, FlagTriangleRight, Rocket, Users } from "lucide-react";
import { useEffect, useState } from "react";

type Tarea = {
	descripcion: string | null;
	entorno: string;
	estado: string;
	fecha_fin: string | null;
	fecha_inicio: string;
	id: string;
	prioridad: string;
	propietario: string;
	slug: string;
	titulo: string;
};

export default function AjustesTarea({
	tarea,
	usuarios: usuariosTarea,
}: {
	tarea: Tarea;
	usuarios: UsuariosTareas[] | null;
}) {
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
	const [estado, setEstado] = useState(tarea.estado);
	const [fechaFinal, setFechaFinal] = useState<Date | undefined>(new Date(tarea.fecha_fin!));
	const [usuarios, setUsuarios] = useState<UsuariosTareas[] | null>(usuariosTarea);
	const [usuariosEntorno, setUsuariosEntorno] = useState<UsuariosEntorno[] | null>(null);
	const [prioridad, setPrioridad] = useState(tarea.prioridad);
	const [mostrarUsuarios, setMostrarUsuarios] = useState(false);

	// Evitar que se ejecuten los useEffects en el primer render
	useEffect(() => {
		if (initial) {
			setInitial(false);
			return;
		}
	}, [usuarios, estado, initial, prioridad, fechaFinal]);

	// Actualizar usuarios
	useEffect(() => {
		if (initial || !usuarios) return;
		cambiarUsuariosTarea(tarea.id, usuarios);
	}, [usuarios]);

	// Mostrar los usuarios del entorno
	useEffect(() => {
		if (mostrarUsuarios) {
			if (initial) return;
			try {
				getUsuariosFromEntorno(tarea.entorno).then(data => {
					if (data) setUsuariosEntorno(data);
				});
			} catch (error) {
				console.log(error);
			}
		}
	}, [mostrarUsuarios]);

	// Actualizar estado
	useEffect(() => {
		if (initial) return;
		try {
			cambiarEstadoTarea(tarea.id, estado);
		} catch (error) {
			console.log(error);
		}
	}, [estado]);

	// Actualizar fecha
	useEffect(() => {
		if (initial) return;
		try {
			if (fechaFinal) cambiarFechaFinal(tarea.id, fechaFinal.toISOString());
		} catch (error) {
			console.log(error);
		}
	}, [fechaFinal]);

	// Actualizar prioridad
	useEffect(() => {
		if (initial) return;
		try {
			cambiarPrioridadTarea(tarea.id, prioridad);
		} catch (error) {
			console.log(error);
		}
	}, [prioridad]);

	// Función para añadir o quitar un usuario
	function addRemoveUsuario(idUsuario: string) {
		const usuario = usuariosEntorno?.find(usuario => usuario.id === idUsuario);

		const inTarea = usuarios?.find(usuario => usuario.Usuarios?.id === idUsuario);

		if (inTarea) {
			setUsuarios(usuarios!.filter(item => item.Usuarios?.id !== idUsuario));
		} else {
			setUsuarios(usuarios!.concat([{ Usuarios: usuario! }]));
		}
	}

	function toggleEstadoCompletado() {
		if (estado === "Completado") {
			setEstado("Abierto");
		} else {
			setEstado("Completado");
		}
	}

	function toggleUsuarios() {
		setMostrarUsuarios(!mostrarUsuarios);
		document.getElementById("usuarios")?.classList.toggle("hidden");
	}

	function toggleCalendario() {
		document.getElementById("calendario")?.classList.toggle("hidden");
	}

	return (
		<div className="my-16 grid md:w-2/3 grid-cols-2 grid-rows-2 sm:gap-x-24 gap-y-4 sm:gap-y-2">
			<div className="flex flex-col md:flex-row justify-between gap-2">
				<div className="flex items-center gap-2 text-neutral-400">
					<CirclePower className="size-5" /> <span>Estado</span>
				</div>
				<div className="flex w-1/2 items-center gap-2">
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
							"size-8 cursor-pointer rounded p-2 hidden sm:block",
							estado === "Completado" ? "bg-green-600" : "border border-neutral-500",
						)}
						onClick={toggleEstadoCompletado}
					/>
				</div>
			</div>

			<div className="flex flex-col md:flex-row justify-between gap-2">
				<div className="flex items-center gap-2 text-neutral-400">
					<Users className="size-5" /> <span>Usuarios</span>
				</div>
				<div
					className="relative flex w-1/2 cursor-pointer items-center pl-2"
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
								{usuario.Usuarios!.nombre_completo.slice(0, 1).toUpperCase()}
							</div>
						))}

					<div
						className="absolute top-8 hidden w-64 rounded border border-neutral-800 bg-neutral-900 p-1"
						id="usuarios"
					>
						{usuariosEntorno &&
							usuariosEntorno.map(usuario => (
								<div
									key={usuario.id}
									className={clsx(
										"flex cursor-pointer items-center gap-2 border-b border-neutral-800 px-2 py-1",
										usuarios?.find(user => user.Usuarios?.id == usuario.id) &&
											"bg-neutral-800",
									)}
									onClick={() => addRemoveUsuario(usuario.id)}
								>
									<div
										className={
											"flex size-7 items-center justify-center rounded-full border-2 border-neutral-900 text-center text-sm " +
											usuario.color
										}
									>
										{usuario.nombre_completo.slice(0, 1).toUpperCase()}
									</div>
									<span>{usuario.nombre_completo}</span>
								</div>
							))}
					</div>
				</div>
			</div>

			<div className="flex flex-col md:flex-row justify-between gap-2">
				<div className="flex items-center gap-2 text-neutral-400">
					<CalendarDays className="size-5" /> <span>Fecha límite</span>
				</div>
				<div className="relative flex w-1/2 cursor-pointer items-center">
					<span
						onClick={toggleCalendario}
						className={clsx(
							"font-mono font-semibold",
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

			<div className="flex flex-col md:flex-row justify-between gap-2">
				<div className="flex items-center gap-2 text-neutral-400">
					<Rocket className="size-5" /> <span>Prioridad</span>
				</div>
				<div className={"flex w-1/2 items-center " + prioridades[prioridad]}>
					<FlagTriangleRight className={"size-5 " + prioridades[prioridad]} />
					<select
						className="cursor-pointer appearance-none bg-neutral-900 px-1"
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
	);
}
