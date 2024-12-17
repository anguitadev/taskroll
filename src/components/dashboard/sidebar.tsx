"use client";

import { Tables } from "@/db.types";
import { getUsuario } from "@/lib/auth/data-client";
import { isUsuarioEquipoAdmin } from "@/lib/equipos/data-client";
import { getNotificacionNumberByEquipo } from "@/lib/notificaciones/data-client";
import type { EntornosFromUsuario, EquiposFromUsuario } from "@/lib/panel/types";
import clsx from "clsx";
import {
	ArrowLeft,
	ArrowLeftFromLine,
	ArrowRight,
	ArrowRightFromLine,
	Bell,
	BriefcaseBusiness,
	ChevronDown,
	ChevronRight,
	FileText,
	House,
	List,
	LogOut,
	Plus,
	Settings,
	Timer,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NuevoEntorno from "../entornos/nuevo-entorno";
import NuevoProyecto from "../proyectos/nuevo-proyecto";
import AjustesSidebar from "./ajustes-sidebar";

export default function Sidebar({
	className,
	equipos,
	usuario,
	entornos,
	proyectos,
}: {
	className: string;
	equipos: EquiposFromUsuario;
	usuario: Tables<"Usuarios">;
	entornos: EntornosFromUsuario;
	proyectos: Record<string, { id: string; nombre: string; slug: string }[]> | undefined;
}) {
	const [equipo, setEquipo] = useState<Tables<"Equipos">>(equipos[0].Equipos!);

	const links = [
		{ name: "Inicio", icon: House, href: "/" + equipo!.slug },
		{ name: "Marcajes", icon: Timer, href: "/" + equipo!.slug + "/marcajes" },
		{ name: "Notificaciones", icon: Bell, href: "/" + equipo!.slug + "/notificaciones" },
		{ name: "Documentos", icon: FileText, href: "/" + equipo!.slug + "/documentos" },
	];

	const pathname = usePathname();
	const [ajustes, setAjustes] = useState(false);
	const [nombreCompleto, setNombreCompleto] = useState<string | null>(usuario.nombre_completo);
	const [color, setColor] = useState<string | null>(usuario.color);
	const [sidebar, setSidebar] = useState(false);
	const [entorno, setEntorno] = useState<string | null>(null);
	const [entornosSidebar, setEntornosSidebar] = useState(entornos);
	const [notificaciones, setNotificaciones] = useState(0);
	const [isAdmin, setIsAdmin] = useState(true);

	const router = useRouter();

	// Cargar datos del usuario si viene de ajustes
	useEffect(() => {
		getUsuario().then(data => {
			setNombreCompleto(data?.nombre_completo);
			setColor(data?.color);
		});
	}, [ajustes]);

	// Cambiar la vista al sidebar de ajustes
	useEffect(() => {
		if (pathname.split("/")[2] === "ajustes") {
			setAjustes(true);
		} else {
			setAjustes(false);
		}
	}, [pathname]);

	// Cambiar el equipo según la URL
	useEffect(() => {
		equipos.forEach(equipo => {
			if (equipo.Equipos?.slug === pathname.split("/")[1]) {
				setEquipo(equipo.Equipos);
			}
		});
	}, [equipos, pathname, ajustes]);

	// Comprobar si el usuario es admin
	useEffect(() => {
		isUsuarioEquipoAdmin(equipo.slug).then(data => setIsAdmin(data));
	}, [equipo]);

	// Ocultar el popover cuando cambie la URL
	useEffect(() => {
		document.getElementById("select")?.hidePopover();
	}, [pathname]);

	// Actualizar la lista de entornos cuando cambie el equipo
	useEffect(() => {
		setEntornosSidebar(entornos.filter(entorno => entorno.Entornos.equipo === equipo.id));
	}, [equipo, entornos]);

	// Actualizar el numero de notificaciones
	useEffect(() => {
		setNotificaciones(0);
		getNotificacionNumberByEquipo(equipo.id).then(data => data > 0 && setNotificaciones(data));
	}, [pathname, equipo.id]);

	//Cambiar el equipo
	function handleTeamChange(equipo: Tables<"Equipos">) {
		setEquipo(equipo);
		redirect(`/${equipo.slug}`);
	}

	// Mostrar u ocultar el sidebar en móvil
	function toggleSidebar() {
		setSidebar(!sidebar);
	}

	// Crear nuevo proyecto
	function handleNuevoProyecto(entornoId: string) {
		setEntorno(entornoId);
		document.getElementById("nuevo-proyecto")?.showPopover();
	}

	// Mostrar u ocultar los proyectos
	function toggleProyectos(entorno: string) {
		const proyectos = document.getElementById("proyectos-" + entorno);
		const toggle = document.getElementById(entorno + "-toggle");
		if (proyectos) {
			proyectos.classList.toggle("hidden");
		}
		if (toggle) {
			toggle.classList.toggle("rotate-90");
		}
	}

	// Mostrar todos los proyectos
	function openProyectos(entorno: string) {
		const proyectos = document.getElementById("proyectos-" + entorno);
		const toggle = document.getElementById(entorno + "-toggle");
		if (proyectos) {
			proyectos.classList.remove("hidden");
		}
		if (toggle) {
			toggle.classList.add("rotate-90");
		}
	}

	return (
		<>
			{!sidebar && (
				<ArrowRightFromLine
					className="absolute inset-3 z-10 size-6 stroke-neutral-400 sm:hidden"
					onClick={toggleSidebar}
				/>
			)}
			<div
				id="sidebar"
				className={clsx(
					`h-screen flex-col z-10 justify-stretch sm:flex ${className}`,
					sidebar
						? "absolute flex min-w-52 border-r border-neutral-800 bg-neutral-950 p-2"
						: "hidden",
				)}
			>
				<div className={`grow flex-col flex ${className}`}>
					<div className="flex flex-row items-center justify-between p-3">
						<Link href={"/" + equipo!.slug} className="text-xl font-semibold">
							Taskroll
						</Link>
						{sidebar ? (
							<ArrowLeftFromLine
								className="absolute inset-4 ml-40 size-6 stroke-neutral-400 sm:hidden"
								onClick={toggleSidebar}
							/>
						) : (
							<div className="flex flex-row gap-3">
								<ArrowLeft
									className="size-5 cursor-pointer"
									onClick={() => router.back()}
								/>
								<ArrowRight
									className="size-5 cursor-pointer"
									onClick={() => router.forward()}
								/>
							</div>
						)}
					</div>
					{ajustes ? (
						<AjustesSidebar
							className={className}
							equipo={equipo}
							isAdmin={isAdmin}
							entornos={entornos}
						/>
					) : (
						<div className="flex max-h-[calc(100vh-70px)] grow flex-col justify-stretch">
							<div>
								<div className="relative">
									<button
										id="team-button"
										className="flex w-full flex-row items-center gap-4 p-3 text-lg font-semibold hover:cursor-pointer"
										popoverTarget="select"
									>
										<div className="flex flex-row items-center gap-2">
											<span
												className={clsx(
													"flex size-7 items-center justify-center rounded text-neutral-200",
													equipo!.color,
												)}
											>
												{equipo.nombre.toUpperCase().charAt(0)}
											</span>
											<span>{equipo.nombre}</span>
										</div>
										<ChevronDown className="size-5 stroke-neutral-500" />
									</button>
									<div
										id="select"
										popover="auto"
										className="max-w-[calc(100vw-4%)] absolute inset-0 left-2 top-28 m-0 w-64 rounded border border-neutral-800 bg-neutral-950 text-sm"
									>
										{equipos.map(equipo => {
											return (
												<div
													key={equipo.Equipos?.id}
													className="flex flex-row items-center gap-2 p-3 hover:cursor-pointer hover:bg-neutral-800"
													onClick={() =>
														handleTeamChange(equipo.Equipos!)
													}
												>
													<span
														className={clsx(
															"flex size-5 items-center justify-center rounded text-neutral-200",
															equipo.Equipos?.color,
														)}
													>
														{equipo.Equipos?.nombre
															.toUpperCase()
															.charAt(0)}
													</span>
													<span>{equipo.Equipos?.nombre}</span>
												</div>
											);
										})}
										<div className="border-t border-neutral-700">
											{isAdmin && (
												<Link
													href={"/" + equipo.slug + "/ajustes/equipo"}
													className="flex flex-row items-center gap-2 p-3 text-neutral-400 hover:cursor-pointer hover:bg-neutral-800"
												>
													<Settings className="size-4" />
													Ajustes del Equipo
												</Link>
											)}
											<div
												className="flex flex-row items-center gap-2 p-3 text-neutral-400 hover:cursor-pointer hover:bg-neutral-800"
												onClick={() => redirect("/nuevo-equipo")}
											>
												<Plus className="size-4" />
												Añadir Nuevo Equipo
											</div>
										</div>
									</div>
								</div>
								<div className="mt-3 flex flex-col gap-1">
									{links.map(link => {
										const LinkIcon = link.icon;
										return (
											<Link
												key={link.name}
												href={link.href}
												className={clsx(
													"flex items-center gap-2 rounded p-2 px-3 text-sm transition hover:bg-neutral-800 md:justify-start",
													{
														"bg-neutral-800": pathname === link.href,
													},
												)}
											>
												<div className="flex grow items-center gap-3">
													<LinkIcon className="size-5" />
													<span>{link.name}</span>
												</div>
												{link.name === "Notificaciones" &&
													notificaciones > 0 && (
														<span className="flex size-5 items-center justify-center rounded-full bg-indigo-500 text-xs">
															{notificaciones}
														</span>
													)}
											</Link>
										);
									})}
								</div>
								<div className="mt-3 flex flex-row items-center justify-between p-3">
									<span className="text-lg font-medium">Entornos</span>
									<NuevoEntorno equipo={equipo} />
								</div>
							</div>
							<div className="flex max-w-64 grow flex-col gap-1 overflow-x-hidden overflow-y-scroll">
								<Link
									href={`/${equipo?.slug}/tareas`}
									className={clsx(
										"flex items-center gap-3 rounded p-2 px-3 text-sm transition hover:bg-neutral-800 md:justify-start",
										{
											"bg-neutral-800":
												pathname === `/${equipo?.slug}/tareas`,
										},
									)}
								>
									<BriefcaseBusiness className="size-5" />
									<span>Todos los entornos</span>
								</Link>
								{entornosSidebar.length > 0 ? (
									entornosSidebar.map(entorno => {
										const entornoData = entorno.Entornos;
										if (!entornoData) return null;

										const isCurrentPath = pathname
											.split("/")
											.includes(entornoData.slug);

										if (isCurrentPath) {
											openProyectos(entornoData.slug);
										}

										return (
											<div key={entornoData.nombre}>
												<div
													className={clsx(
														"group max-w-64 rounded p-2 px-3 text-sm transition hover:bg-neutral-800 md:justify-start",
														{
															"bg-neutral-800": isCurrentPath,
														},
													)}
												>
													<div className="flex max-w-64 flex-row items-center justify-between">
														<div className="flex grow items-center gap-3 overflow-hidden">
															<div>
																<span
																	className={clsx(
																		"text-md flex size-5 items-center justify-center rounded font-semibold group-hover:hidden",
																		entornoData.color,
																	)}
																>
																	{entornoData.nombre
																		?.charAt(0)
																		.toUpperCase()}
																</span>
																<ChevronRight
																	id={`${entornoData.slug}-toggle`}
																	className="hidden size-5 rounded stroke-neutral-500 p-0.5 hover:bg-neutral-700 group-hover:flex"
																	onClick={() =>
																		toggleProyectos(
																			entornoData.slug,
																		)
																	}
																/>
															</div>
															<Link
																href={`/${equipo?.slug}/${entornoData.slug}`}
																className="grow truncate"
															>
																{entornoData.nombre}
															</Link>
														</div>
														<div
															className={clsx(
																"gap-1 transition-all group-hover:flex",
																isCurrentPath ? "flex" : "hidden",
															)}
														>
															<Link
																href={`/${equipo?.slug}/ajustes/${entornoData.slug}`}
															>
																<Settings className="size-5 rounded stroke-neutral-500 p-0.5 transition hover:bg-neutral-700" />
															</Link>
															<button
																onClick={() =>
																	handleNuevoProyecto(
																		entornoData.id,
																	)
																}
															>
																<Plus className="size-5 rounded stroke-neutral-500 transition hover:bg-neutral-700" />
															</button>
														</div>
													</div>
												</div>
												<div
													id={`proyectos-${entornoData.slug}`}
													className="hidden"
												>
													{proyectos && proyectos[entornoData.id] ? (
														proyectos[entornoData.id].map(proyecto => {
															const isCurrentProyecto = pathname
																.split("/")
																.includes(proyecto.slug);
															if (isCurrentProyecto) {
																openProyectos(entornoData.slug);
															}
															return (
																<Link
																	key={proyecto.id}
																	href={`/${equipo?.slug}/${entornoData.slug}/${proyecto.slug}`}
																	className={clsx(
																		"flex flex-row items-center gap-3 rounded p-2 px-3 text-sm transition hover:bg-neutral-800 md:justify-start",
																		{
																			"bg-neutral-800":
																				isCurrentProyecto,
																		},
																	)}
																>
																	<List className="size-5 rounded stroke-neutral-500 p-0.5" />
																	<span className="truncate">
																		{proyecto.nombre}
																	</span>
																</Link>
															);
														})
													) : (
														<span
															className="ml-4 cursor-pointer text-sm text-neutral-400 underline"
															onClick={() =>
																handleNuevoProyecto(entornoData.id)
															}
														>
															Crear nuevo proyecto
														</span>
													)}
												</div>
											</div>
										);
									})
								) : (
									<button
										popoverTarget="nuevo-entorno"
										className="ml-4 cursor-pointer text-left text-sm text-neutral-400 underline"
									>
										Crear nuevo entorno
									</button>
								)}
								<NuevoProyecto entorno={entorno} />
							</div>
							<div className="flex w-48 grow-0 flex-row items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-2 lg:w-64">
								<div>
									<Link
										href={"/" + equipo.slug + "/ajustes/cuenta/perfil"}
										className="flex flex-row items-center gap-3 text-sm font-semibold"
									>
										<span
											className={clsx(
												"flex size-5 items-center justify-center rounded text-neutral-200",
												color,
											)}
										>
											{nombreCompleto?.charAt(0).toUpperCase()}
										</span>
										{nombreCompleto}
									</Link>
								</div>
								<form action="/signout" method="post" className="flex">
									<button type="submit">
										<LogOut className="size-5 stroke-neutral-400" />
									</button>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
