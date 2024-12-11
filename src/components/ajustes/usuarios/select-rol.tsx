"use client";

import { updateUsuarioRolEntorno, updateUsuarioRolEquipo } from "@/lib/actions";
import { useState } from "react";

export default function SelectRol({
	admin,
	usuarioId,
	equipoId,
	entornoId,
}: {
	admin: boolean;
	usuarioId: string;
	equipoId?: string;
	entornoId?: string;
}) {
	const [rol, setRol] = useState(admin ? "admin" : "miembro");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleRoleChange = async (newRol: string) => {
		setRol(newRol);
		setLoading(true);
		setError(null);

		if (equipoId) {
			try {
				await updateUsuarioRolEquipo(newRol, usuarioId, equipoId);
			} catch (err) {
				console.error("No se ha podido actualizar el rol:", err);
				setError("No se ha podido actualizar el rol. Pro favor, intenta de nuevo. " + err);
				setRol(admin ? "admin" : "miembro");
			} finally {
				setLoading(false);
			}
		}

		if (entornoId) {
			try {
				await updateUsuarioRolEntorno(newRol, usuarioId, entornoId);
			} catch (err) {
				console.error("No se ha podido actualizar el rol:", err);
				setError("No se ha podido actualizar el rol. Pro favor, intenta de nuevo. " + err);
				setRol(admin ? "admin" : "miembro");
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div>
			<select
				className="rounded bg-neutral-900"
				value={rol}
				onChange={e => handleRoleChange(e.target.value)}
				disabled={loading}
			>
				<option value="admin">Admin</option>
				<option value="miembro">Miembro</option>
			</select>
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}
