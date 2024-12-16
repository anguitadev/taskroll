"use client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BusquedaTareas() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	// Si existe una busqueda, se muestra en el input
	function handleSearch(tarea: string) {
		const params = new URLSearchParams(searchParams);
		if (tarea) {
			params.set("query", tarea);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}

	return (
		<div className="flex gap-2 items-center">
            <Search className="size-5 stroke-neutral-400" />
			<input
				type="text"
				placeholder="Buscar tarea..."
				className="rounded border border-neutral-700 p-1 text-sm bg-transparent placeholder:text-neutral-400"
				onChange={e => {
					handleSearch(e.target.value);
				}}
				defaultValue={searchParams.get("query")?.toString()}
			/>
		</div>
	);
}
