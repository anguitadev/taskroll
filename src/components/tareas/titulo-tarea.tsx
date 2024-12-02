"use client";

import { updateTituloTarea } from "@/lib/actions";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function TituloTarea({
	tituloTarea,
	idTarea,
}: {
	tituloTarea: string;
	idTarea: string;
}) {
	const [initial, setInitial] = useState(true);
	const [titulo, setTitulo] = useState(tituloTarea);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		if (initial) {
			setInitial(false);
			return;
		}
	}, [titulo]);

	useEffect(() => {
		if (initial) return;
		try {
			updateTituloTarea(idTarea, titulo);
		} catch (error) {
			console.log(error);
		}
	}, [titulo]);

	function handleTituloEdit(titulo: string) {
		setTitulo(titulo);
		if (titulo !== "") setEdit(!edit);
	}

	return (
		<div>
			{edit && (
				<input
					type="text"
					defaultValue={titulo}
					className={clsx(
						"w-full rounded border border-neutral-900 text-3xl font-bold hover:border-neutral-700",
						titulo === "" && "border-red-500",
					)}
					onBlur={e => handleTituloEdit(e.target.value)}
				/>
			)}
			<h1
				onClick={() => setEdit(!edit)}
				className={clsx(
					"rounded border border-neutral-900 text-3xl font-bold hover:border-neutral-700",
					edit && "hidden",
				)}
			>
				{titulo}
			</h1>
		</div>
	);
}
