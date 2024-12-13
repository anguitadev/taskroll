"use client";

import { EntornosFromUsuario } from "@/lib/panel/types";
import clsx from "clsx";
import { BriefcaseBusiness, ChevronLeft, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AjustesSidebar({
	className,
	equipo,
	isAdmin,
	entornos,
}: {
	className: string;
	equipo: {
		id: string;
		nombre: string;
		slug: string;
	};
	isAdmin: boolean;
	entornos: EntornosFromUsuario;
}) {
	const pathname = usePathname();

	const equipoSlug = pathname.split("/")[1];

	const [entornosAdmin, setEntornosAdmin] = useState<EntornosFromUsuario>([]);
	const [proyectosAdmin, setProyectosAdmin] = useState<EntornosFromUsuario>([]);

	useEffect(() => {
		if (entornos) {
			setEntornosAdmin(
				entornos.filter(
					item =>
						item.Entornos.entorno === null &&
						item.admin &&
						item.Entornos.equipo === equipo.id,
				),
			);
			setProyectosAdmin(
				entornos.filter(item => item.Entornos.entorno !== null && item.admin),
			);
		}
	}, [entornos]);

	return (
		<div className={`flex flex-col ${className}`}>
			<Link
				href={"/" + equipoSlug}
				className="mt-5 flex items-center gap-2 rounded px-3 font-semibold"
			>
				<ChevronLeft className="size-5" />
				Ajustes
			</Link>
			{isAdmin && (
				<div className="my-3">
					<span className="flex items-center gap-2 rounded p-2 px-3 font-semibold text-neutral-400">
						<Users className="size-5" />
						Equipo
					</span>
					<div className="ml-7">
						<Link
							href={"/" + equipo!.slug + "/ajustes/equipo"}
							className={clsx(
								"flex items-center rounded p-1 px-3 text-sm transition hover:bg-neutral-800",
								{
									"bg-neutral-800":
										pathname === "/" + equipo!.slug + "/ajustes/equipo",
								},
							)}
						>
							General
						</Link>
						<Link
							href={"/" + equipo!.slug + "/ajustes/miembros"}
							className={clsx(
								"flex items-center rounded p-1 px-3 text-sm transition hover:bg-neutral-800",
								{
									"bg-neutral-800":
										pathname === "/" + equipo!.slug + "/ajustes/miembros",
								},
							)}
						>
							Miembros
						</Link>
					</div>
				</div>
			)}
			{entornosAdmin.length > 0 && (
				<div className="my-3">
					<span className="flex items-center gap-2 rounded p-2 px-3 font-semibold text-neutral-400">
						<BriefcaseBusiness className="size-5" />
						Entornos
					</span>

					{entornosAdmin.map(entorno => (
						<div className="ml-7" key={entorno.Entornos.id}>
							<Link
								href={`/${equipo.slug}/ajustes/${entorno.Entornos.slug}`}
								className={clsx(
									"flex items-center rounded p-1 px-3 text-sm transition hover:bg-neutral-800",
									{
										"bg-neutral-800":
											pathname === "/" + equipo.slug + "/ajustes/" + entorno.Entornos.slug,
									},
								)}
							>
								{entorno.Entornos.nombre}
							</Link>
							<div className="ml-4">
								{proyectosAdmin.length > 0 &&
									proyectosAdmin.map(
										proyecto =>
											proyecto.Entornos.entorno === entorno.Entornos.id && (
												<Link
													href={`/${equipo.slug}/ajustes/${proyecto.Entornos.slug}`}
													key={proyecto.Entornos.id}
													className={clsx(
														"flex items-center rounded p-1 px-3 text-sm transition hover:bg-neutral-800",
														{
															"bg-neutral-800":
																pathname === "/" + equipo.slug + "/ajustes/" + proyecto.Entornos.slug,
														},
													)}
												>
													{proyecto.Entornos.nombre}
												</Link>
											),
									)}
							</div>
						</div>
					))}
				</div>
			)}
			<div className="my-3">
				<span className="flex items-center gap-2 rounded p-2 px-3 font-semibold text-neutral-400">
					<UserCog className="size-5" />
					Mi Cuenta
				</span>
				<div className="ml-7">
					<Link
						href={"/" + equipo!.slug + "/ajustes/cuenta/perfil"}
						className={clsx(
							"flex items-center rounded p-1 px-3 text-sm transition hover:bg-neutral-800",
							{
								"bg-neutral-800":
									pathname === "/" + equipo!.slug + "/ajustes/cuenta/perfil",
							},
						)}
					>
						Perfil
					</Link>
				</div>
			</div>
		</div>
	);
}
