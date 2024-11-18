"use client";

import { Tables } from "@/db.types";
import { createClient } from "@/utils/supabase/client";
import clsx from "clsx";
import {
	ArrowLeft,
	ArrowRight,
	BriefcaseBusiness,
	ChevronDown,
	FileText,
	House,
	LogOut,
	Mail,
	Plus,
	Search,
	Settings,
	Timer,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AjustesSidebar from "./ajustes-sidebar";

const entornos = [
	{ name: "Entorno 1", icon: "E", href: "/dashboard/entornos/entorno-1" },
	{ name: "Entorno 2", icon: "F", href: "/dashboard/entornos/entorno-2" },
	{ name: "Entorno 3", icon: "A", href: "/dashboard/entornos/entorno-3" },
	{ name: "Entorno 4", icon: "C", href: "/dashboard/entornos/entorno-4" },
	{ name: "Entorno 5", icon: "H", href: "/dashboard/entornos/entorno-5" },
];

export default function Sidebar({
	className,
	equipos,
	usuario,
}: {
	className: string;
	equipos: {
		Equipos: {
			color: string;
			created_at: string;
			id: string;
			nombre: string;
			slug: string;
		} | null;
	}[];
	usuario: Tables<"Usuarios">;
}) {
	const pathname = usePathname();
	const [ajustes, setAjustes] = useState(false);
	const [nombreCompleto, setNombreCompleto] = useState<string | null>(null);
	const [color, setColor] = useState<string | null>(null);

	const supabase = createClient();

	const router = useRouter();

	const getUsuario = useCallback(async () => {
		try {
			const { data } = await supabase
				.from("Usuarios")
				.select(`nombre_completo, color`)
				.eq("nombre_usuario", usuario.nombre_usuario)
				.single();

			if (data) {
				setNombreCompleto(data.nombre_completo);
				setColor(data.color);
			}
		} catch (error) {
			console.log(error);
		}
	}, [usuario, supabase]);

	useEffect(() => {
		getUsuario();
	}, [getUsuario, usuario, ajustes]);

	useEffect(() => {
		if (pathname.split("/")[2] === "ajustes") {
			setAjustes(true);
		} else {
			setAjustes(false);
		}
	}, [pathname]);

	const [equipo, setEquipo] = useState<{
		id: string;
		nombre: string;
		slug: string;
		color: string;
	}>(equipos[0].Equipos!);

	useEffect(() => {
		equipos.forEach(equipo => {
			if (equipo.Equipos?.slug === pathname.split("/")[1]) {
				setEquipo(equipo.Equipos);
			}
		});
	}, [equipos, pathname, ajustes]);

	function handleTeamChange(equipo: { id: string; nombre: string; slug: string; color: string }) {
		setEquipo(equipo);
		redirect(`/${equipo.slug}`);
	}

	const links = [
		{ name: "Inicio", icon: House, href: "/" + equipo!.slug },
		{ name: "Marcajes", icon: Timer, href: "/" + equipo!.slug + "/marcajes" },
		{ name: "Bandeja de entrada", icon: Mail, href: "/" + equipo!.slug + "/bandeja-entrada" },
		{ name: "Documentos", icon: FileText, href: "/" + equipo!.slug + "/documentos" },
	];

	return (
		<div className={`flex flex-col ${className}`}>
			<div className="flex flex-row items-center justify-between p-3">
				<Link href={"/" + equipo!.slug} className="text-xl font-semibold">
					Taskroll
				</Link>
				<div className="flex flex-row gap-3">
					<ArrowLeft className="size-5 cursor-pointer" onClick={() => router.back()} />
					<ArrowRight
						className="size-5 cursor-pointer"
						onClick={() => router.forward()}
					/>
				</div>
			</div>
			{ajustes ? (
				<AjustesSidebar className={className} equipo={equipo} />
			) : (
				<>
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
							className="absolute inset-0 left-2 top-28 m-0 w-64 rounded border border-neutral-800 bg-neutral-950 text-sm"
						>
							{equipos.map(equipo => {
								return (
									<div
										key={equipo.Equipos?.id}
										className="flex flex-row items-center gap-2 p-3 hover:cursor-pointer hover:bg-neutral-800"
										onClick={() => handleTeamChange(equipo.Equipos!)}
									>
										<span
											className={clsx(
												"flex size-5 items-center justify-center rounded text-neutral-200",
												equipo.Equipos?.color,
											)}
										>
											{equipo.Equipos?.nombre.toUpperCase().charAt(0)}
										</span>
										<span>{equipo.Equipos?.nombre}</span>
									</div>
								);
							})}
							<div className="border-t border-neutral-700">
								<Link
									href={"/" + equipo.slug + "/ajustes/equipo"}
									className="flex flex-row items-center gap-2 p-3 text-neutral-400 hover:cursor-pointer hover:bg-neutral-800"
								>
									<Settings className="size-4" />
									Ajustes del Equipo
								</Link>
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
										"flex grow items-center justify-center gap-3 rounded p-3 text-sm transition hover:bg-neutral-800 md:flex-none md:justify-start md:p-2 md:px-3",
										{
											"bg-neutral-800": pathname === link.href,
										},
									)}
								>
									<LinkIcon className="size-5" />
									<p className="hidden md:block">{link.name}</p>
								</Link>
							);
						})}
					</div>
					<div className="mt-3 flex flex-row items-center justify-between p-3">
						<span className="text-lg font-medium">Entornos</span>
						<div className="flex flex-row items-center gap-3">
							<Search className="size-5 stroke-neutral-400" />
							<Plus className="flex items-center justify-center rounded bg-indigo-500 p-0.5" />
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<Link
							href="/dashboard/entornos"
							className={clsx(
								"flex grow items-center justify-center gap-3 rounded p-3 text-sm transition hover:bg-neutral-800 md:flex-none md:justify-start md:p-2 md:px-3",
								{
									"bg-neutral-800": pathname === "/dashboard/entornos",
								},
							)}
						>
							<BriefcaseBusiness className="size-5" />
							<p className="hidden md:block">Todos los entornos</p>
						</Link>
						{entornos.map(link => {
							return (
								<Link
									key={link.name}
									href={link.href}
									className={clsx(
										"flex grow items-center justify-center gap-3 rounded p-3 text-sm transition hover:bg-neutral-800 md:flex-none md:justify-start md:p-2 md:px-3",
										{
											"bg-neutral-800": pathname === link.href,
										},
									)}
								>
									<span className="text-md flex size-5 items-center justify-center rounded bg-indigo-500 font-semibold">
										{link.icon}
									</span>
									<p className="hidden md:block">{link.name}</p>
								</Link>
							);
						})}
					</div>
					<div className="absolute bottom-2 left-2 flex w-64 flex-row items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-2">
						<div className="">
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
				</>
			)}
		</div>
	);
}
