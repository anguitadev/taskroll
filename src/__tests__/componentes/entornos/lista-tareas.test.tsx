import ListaTareas from "@/components/entornos/lista-tareas";
import { Tarea } from "@/lib/tareas/types";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import moment from "moment";
import { describe, expect, it, vi } from "vitest";

vi.mock("resend", () => ({
	Resend: vi.fn(() => ({
		send: vi.fn(),
	})),
}));

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

vi.mock("@/lib/tareas/data-client", () => ({
	getUsuariosByTarea: vi.fn(),
}));

describe("ListaTareas Component", () => {
	const mockTareas: Tarea[] = [
		{
			usuario: { color: "bg-red-600", nombre_completo: "Usuario 1" },
			tarea: {
				id: "1",
				titulo: "Tarea 1",
				slug: "tarea-1",
				fecha_fin: moment().subtract(1, "days").toISOString(),
				estado: "pendiente",
				prioridad: "alta",
				entorno: { nombre: "Entorno 1", entorno: { nombre: "Proyecto 1" } },
			},
		},
		{
			usuario: { color: "bg-green-600", nombre_completo: "Usuario 2" },
			tarea: {
				id: "2",
				titulo: "Tarea 2",
				slug: "tarea-2",
				fecha_fin: moment().add(1, "days").toISOString(),
				estado: "pendiente",
				prioridad: "baja",
				entorno: { nombre: "Entorno 2", entorno: { nombre: "Proyecto 2" } },
			},
		},
		{
			usuario: { color: "bg-orange-600", nombre_completo: "Usuario 3" },
			tarea: {
				id: "3",
				titulo: "Tarea 3",
				slug: "tarea-3",
				fecha_fin: moment().add(2, "days").toISOString(),
				estado: "pendiente",
				prioridad: "alta",
				entorno: { nombre: "Entorno 3", entorno: { nombre: "Proyecto 3" } },
			},
		},
	];

	it("test_filter_tasks_by_date", () => {
		render(<ListaTareas tareas={mockTareas} query={undefined} />);

		expect(screen.getByText("Pendientes")).toBeInTheDocument();
		expect(screen.getByText("Mañana")).toBeInTheDocument();
		expect(screen.getByText("Futuro")).toBeInTheDocument();
	});

	it("test_empty_search_query", () => {
		render(<ListaTareas tareas={mockTareas} query={undefined} />);

		expect(screen.queryByText("Resultados de la búsqueda:")).not.toBeInTheDocument();
	});

	it("test_search_tasks_by_title", () => {
		render(<ListaTareas tareas={mockTareas} query="Tarea 2" />);

		expect(screen.getByText("Resultados de la búsqueda:")).toBeInTheDocument();
		expect(screen.getByText("Tarea 2")).toBeInTheDocument();
		expect(screen.queryByText("Tarea 1")).not.toBeInTheDocument();
		expect(screen.queryByText("Tarea 3")).not.toBeInTheDocument();
	});
});
