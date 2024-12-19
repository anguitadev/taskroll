import Incidencia from "@/components/marcajes/incidencia";
import { getUsuario } from "@/lib/auth/data-client";
import { getIncidencias } from "@/lib/marcajes/data-client";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/marcajes/data-client", () => ({
	getIncidencias: vi.fn(),
}));

vi.mock("@/lib/auth/data-client", () => ({
	getUsuario: vi.fn(),
}));

vi.mock("@/utils/supabase/client", () => ({
	createClient: vi.fn(() => ({
		from: vi.fn(() => ({
			insert: vi.fn(() => Promise.resolve({})),
			delete: vi.fn(() => Promise.resolve({ error: null })),
		})),
	})),
}));

describe("Incidencia Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("test_crearIncidencia_success", async () => {
		(getUsuario as Mock).mockResolvedValue({ id: "usuario1" });

		render(<Incidencia />);

		const textarea = screen.getByPlaceholderText("Escribe el mensaje de tu incidencia...");
		const button = screen.getByText("Crear Incidencia");

		fireEvent.change(textarea, { target: { value: "Incidencia de prueba" } });
		fireEvent.click(button);

		expect(await screen.findByText("Incidencia creada correctamente.")).toBeInTheDocument();
	});

	it("test_crearIncidencia_emptyComment", async () => {
		render(<Incidencia />);

		const button = screen.getByText("Crear Incidencia");
		fireEvent.click(button);

		expect(await screen.findByText("Por favor, introduce tu incidencia.")).toBeInTheDocument();
	});

	it("test_fetchIncidencias_onMount", async () => {
		const mockIncidencias = [
			{ id: "1", comentario: "Incidencia 1", creado: new Date().toISOString() },
		];
		(getIncidencias as Mock).mockResolvedValue(mockIncidencias);

		render(<Incidencia />);

		expect(await screen.findByText("Incidencia 1")).toBeInTheDocument();
	});
});
