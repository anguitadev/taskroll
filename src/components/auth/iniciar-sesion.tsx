"use client";

import { login } from "@/lib/auth/actions";
import { Eye, EyeClosed, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function IniciarSesion() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [type, setType] = useState("password");
	const [error, setError] = useState("");

	const searchParams = useSearchParams();
	const loginError = searchParams.get("error");

	const handleToggle = useCallback(() => {
		setType(prevType => (prevType === "text" ? "password" : "text"));
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (email != "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				setError("El correo electrónico no es válido.");
			} else {
				setError("");
			}
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [email]);

	return (
		<form className="mt-8 flex w-full flex-col gap-2 text-left">
			<label htmlFor="email">Correo Electrónico</label>
			<input
				className="rounded border border-neutral-800 bg-transparent px-4 py-2"
				id="email"
				name="email"
				type="email"
				placeholder="correo@electronico.com"
				value={email}
				onChange={e => setEmail(e.target.value)}
				autoComplete="email"
				required
			/>
			{error && <span className="text-sm text-red-500">{error}</span>}
			<label htmlFor="password" className="mt-4">
				Contraseña
			</label>
			<div className="flex">
				<input
					className="w-full rounded border border-neutral-800 bg-transparent px-4 py-2"
					id="password"
					name="password"
					type={type}
					placeholder="contraseña"
					value={password}
					onChange={e => setPassword(e.target.value)}
					autoComplete="current-password"
					required
				/>
				<span className="flex items-center justify-around" onClick={handleToggle}>
					{type === "password" ? (
						<Eye className="absolute mr-12 stroke-neutral-400" size={25} />
					) : (
						<EyeClosed className="absolute mr-12 stroke-neutral-400" size={25} />
					)}
				</span>
			</div>
			{loginError && (
				<span className="mt-4 text-sm text-red-500">Los datos son incorrectos.</span>
			)}
			<button
				formAction={login}
				className="mt-4 rounded border border-indigo-600 bg-indigo-500 px-4 py-2 font-medium"
			>
				Iniciar Sesión
			</button>
			<div className="flex items-center py-3 text-sm text-neutral-400 before:me-6 before:flex-1 before:border-t before:border-neutral-800 after:ms-6 after:flex-1 after:border-t after:border-neutral-800">
				también puedes
			</div>
			<Link
				href="/signup"
				className="flex flex-row items-center justify-center gap-2 rounded border border-neutral-800 px-4 py-3 font-medium"
			>
				<User className="size-5" />
				Crear Nueva Cuenta
			</Link>
		</form>
	);
}
