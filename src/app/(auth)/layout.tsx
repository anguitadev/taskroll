import { checkUsuarioLogin } from "@/lib/auth/actions";
import Link from "next/link";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	// Comprobar si el usuario ha iniciado sesión y redirige a la página del primer equipo
	//o a crear nuevo equipo si no tiene ninguno asignado
	await checkUsuarioLogin();

	return (
		<div className="flex h-screen flex-col font-sans lg:my-0 lg:grid lg:grid-cols-2">
			<div
				className="hidden flex-col justify-between bg-center p-12 lg:flex"
				style={{ backgroundImage: "url('/auth/auth-bg.webp')" }}
			>
				<Link href="/" className="w-fit text-xl font-semibold">
					Taskroll
				</Link>
				<div className="flex flex-col gap-4 font-medium">
					<span className="text-2xl">
						“Taskroll me ha ahorrado incontables horas de trabajo y me ha ayudado a
						entregar productos más rápido que nunca.”
					</span>
					<span className="text-xl text-neutral-300">John Doe</span>
				</div>
			</div>
			<Link href="/" className="mt-12 text-center text-3xl font-semibold lg:hidden">
				Taskroll
			</Link>
			<div className="mx-auto mt-24 w-screen p-4 md:w-96 lg:m-auto">{children}</div>
		</div>
	);
}
