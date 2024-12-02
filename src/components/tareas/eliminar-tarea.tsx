"use client";
import { deleteTareaBySlug } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function EliminarTarea({ slugTarea }: { slugTarea: string }) {
	const pathname = usePathname();
	const router = useRouter();

	function handleDeleteTarea() {
		deleteTareaBySlug(slugTarea);
		router.push(pathname.substring(0, pathname.lastIndexOf("/")));
	}

	return (
		<button
			onClick={handleDeleteTarea}
			className="flex items-center gap-2 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm font-medium text-neutral-400 transition hover:border-red-500 hover:bg-red-600 hover:text-neutral-100"
		>
			<Trash2 className="size-4" />
			Eliminar tarea
		</button>
	);
}
