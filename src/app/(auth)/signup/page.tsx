import Registro from "@/components/auth/registro";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Crear Nueva Cuenta | Taskroll",
};

export default function SignupPage() {
	return (
		<div className="flex flex-col text-center">
			<h1 className="text-2xl font-semibold">Crear Nueva Cuenta</h1>
			<span className="mt-2 text-neutral-400">Introduce tus datos de usuario</span>
			<Registro />
		</div>
	);
}
