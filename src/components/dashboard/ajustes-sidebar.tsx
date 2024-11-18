"use client";

import clsx from "clsx";
import {
	BriefcaseBusiness,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	UserCog,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AjustesSidebar({
	className,
	equipo,
}: {
	className: string;
	equipo: {
		id: string;
		nombre: string;
		slug: string;
	};
}) {
	const pathname = usePathname();

	const equipoSlug = pathname.split("/")[1];

	return (
		<div className={`flex flex-col ${className}`}>
			<Link
				href={"/" + equipoSlug}
				className="flex items-center gap-2 rounded px-3 font-semibold mt-5"
			>
				<ChevronLeft className="size-5" />
				Ajustes
			</Link>
			<div className="my-3">
				<span className="flex items-center gap-2 rounded px-3 font-semibold text-neutral-400 p-2">
					<Users className="size-5" />
					Equipo
				</span>
				<div className="ml-7">
					<Link
						href={"/" + equipo!.slug + "/ajustes/equipo"}
						className={clsx(
							"flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3",
							{
								"bg-neutral-800":
									pathname === "/" + equipo!.slug + "/ajustes/equipo",
							},
						)}
					>
						General
					</Link>
					<span className="flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3">
						Miembros
					</span>
				</div>
			</div>
			<div className="my-3">
				<span className="flex items-center gap-2 rounded px-3 font-semibold text-neutral-400 p-2">
					<BriefcaseBusiness className="size-5" />
					Entornos
				</span>
				<div className="ml-7">
					<span className="flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3">
						Entorno 1
						<ChevronDown className="size-5" />
					</span>
					<div className="ml-4">
						<span className="flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3">
							General
						</span>
						<span className="flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3">
							Miembros
						</span>
					</div>
					<span className="flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3">
						Entorno 2
						<ChevronRight className="size-5" />
					</span>
					<span className="flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3">
						Entorno 3
						<ChevronRight className="size-5" />
					</span>
				</div>
			</div>
			<div className="my-3">
				<span className="flex items-center gap-2 rounded px-3 font-semibold text-neutral-400 p-2">
					<UserCog className="size-5" />
					Mi Cuenta
				</span>
				<div className="ml-7">
					<Link
						href={"/" + equipo!.slug + "/ajustes/cuenta/perfil"}
						className={clsx(
							"flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3",
							{
								"bg-neutral-800":
									pathname === "/" + equipo!.slug + "/ajustes/cuenta/perfil",
							},
						)}
					>
						Perfil
					</Link>
					<span className="flex items-center rounded text-sm transition hover:bg-neutral-800 p-1 px-3">
						Notificaciones
					</span>
				</div>
			</div>
		</div>
	);
}
