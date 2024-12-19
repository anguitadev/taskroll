"use client";
import signup from "@/lib/auth/actions";
import type { FormData, FormErrors } from "@/lib/auth/types";
import { Eye, EyeClosed, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";

export default function Registro() {
	// Datos del formulario
	const [formData, setFormData] = useState<FormData>({
		nombreCompleto: "",
		username: "",
		email: "",
		password: "",
	});

	// Estado para mostrar la contraseña
	const [type, setType] = useState("password");
	// Estado para mostrar errores
	const [errors, setErrors] = useState<FormErrors>({});

	//Comprobar si hay errores
	const searchParams = useSearchParams();
	const error = searchParams?.get("error");

	// Mostrar/ocultar la contraseña
	const handleToggle = useCallback(() => {
		setType(prevType => (prevType === "text" ? "password" : "text"));
	}, []);

	// Actualizar los datos del formulario
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevData => ({ ...prevData, [name]: value }));
	};

	const validateForm = () => {
		const { username, email, password } = formData;
		const errors: FormErrors = {};

		// Comprobar nombre de usuario
		if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
			errors.username =
				"El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.";
		}

		// Comprobar correo electrónico
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = "El correo electrónico no es válido.";
		}

		// Compobar contraseña
		if (!/(?=.*[A-Z])(?=.*\d)(?=.*[+!@#$%^&*;,=])/.test(password)) {
			errors.password =
				"La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.";
		}

		// Mostrar los errores
		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Enviar los datos una vez se han comprobado al servidor para el registro del usuario
	const sendData = (e: FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			const formPayload = new FormData();
			Object.entries(formData).forEach(([key, value]) => formPayload.append(key, value));
			signup(formPayload);
		}
	};
	return (
		<form onSubmit={sendData} className="mt-8 flex w-full flex-col gap-2 text-left">
			<label htmlFor="nombre_completo">Nombre Completo</label>
			<input
				className="rounded border border-neutral-800 bg-transparent px-4 py-2"
				id="nombreCompleto"
				name="nombreCompleto"
				type="text"
				placeholder="John Doe"
				value={formData.nombreCompleto}
				onChange={handleChange}
				required
			/>
			<label htmlFor="nombre_usuario" className="mt-4">
				Nombre de Usuario
			</label>
			<input
				className="rounded border border-neutral-800 bg-transparent px-4 py-2"
				id="username"
				name="username"
				type="text"
				placeholder="johndoe"
				value={formData.username}
				onChange={handleChange}
				required
			/>
			{errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
			<label htmlFor="email" className="mt-4">
				Correo Electrónico
			</label>
			<input
				className="rounded border border-neutral-800 bg-transparent px-4 py-2"
				id="email"
				name="email"
				type="email"
				placeholder="correo@electronico.com"
				autoComplete="email"
				value={formData.email}
				onChange={handleChange}
				required
			/>
			{errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
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
					value={formData.password}
					onChange={handleChange}
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
			{errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
			{error && (
				<span className="mt-4 text-sm text-red-500">
					El nombre de usuario o correo electrónico ya existe.
				</span>
			)}
			<button
				type="submit"
				className="mt-4 flex flex-row items-center justify-center gap-2 rounded border border-indigo-600 bg-indigo-500 px-4 py-2 font-medium"
			>
				<User className="size-5" />
				Crear Nueva Cuenta
			</button>
			<div className="flex items-center py-3 text-sm text-neutral-400 before:me-6 before:flex-1 before:border-t before:border-neutral-800 after:ms-6 after:flex-1 after:border-t after:border-neutral-800">
				también puedes
			</div>
			<Link
				href="/login"
				className="flex flex-row items-center justify-center gap-2 rounded border border-neutral-800 px-4 py-3 font-medium"
			>
				Iniciar Sesión
			</Link>
		</form>
	);
}
