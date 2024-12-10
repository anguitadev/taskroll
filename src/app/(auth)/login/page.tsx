import IniciarSesion from "@/components/auth/iniciar-sesion";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Iniciar Sesión | Taskroll",
};

export default function LoginPage() {
	return (
		<div className="flex flex-col text-center">
			<h1 className="text-2xl font-semibold">Iniciar Sesión</h1>
			<span className="mt-2 text-neutral-400">
				Introduce tu correo electrónico y contraseña
			</span>
			<IniciarSesion />
		</div>
	);
}
