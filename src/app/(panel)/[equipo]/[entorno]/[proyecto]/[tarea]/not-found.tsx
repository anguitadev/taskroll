import { Frown } from "lucide-react";

export default async function NotFound() {
	return (
		<main className="flex h-full flex-col items-center justify-center gap-2">
			<Frown className="w-10 text-gray-400" />
			<h2 className="text-xl font-semibold">404 Not Found</h2>
			<p>No se ha encontrado la tarea.</p>
		</main>
	);
}
