import AjustesDelEquipo from "@/components/ajustes/equipo";
import { Tables } from "@/db.types";
import { updateEquipo } from "@/lib/equipos/actions";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/equipos/actions", () => ({
	updateEquipo: vi.fn(),
	deleteEquipo: vi.fn(),
}));

describe("AjustesDelEquipo Component", () => {
	const equipoMock = {
		id: "1",
		color: "bg-red-600",
		nombre: "Equipo A",
		slug: "equipo-a",
	};

	it("test_handleUpdate_successful", async () => {
		render(<AjustesDelEquipo {...(equipoMock as Tables<"Equipos">)} />);

		const updateButton = screen.getByText("Actualizar");
		fireEvent.click(updateButton);

		expect(updateEquipo).toHaveBeenCalledWith({
			idEquipo: equipoMock.id,
			nombreEquipo: equipoMock.nombre,
			slugEquipo: equipoMock.slug,
			colorEquipo: equipoMock.color,
		});
	});

	it("test_handleUpdate_emptyFields", async () => {
		render(<AjustesDelEquipo {...(equipoMock as Tables<"Equipos">)} />);

		const nombreInput = screen.getByLabelText("Nombre del Equipo");
		const slugInput = screen.getByLabelText("URL del Equipo");
		const updateButton = screen.getByText("Actualizar");

		fireEvent.change(nombreInput, { target: { value: "" } });
		fireEvent.change(slugInput, { target: { value: "" } });
		fireEvent.click(updateButton);

		expect(screen.getByText("Los campos no pueden estar vacíos.")).toBeInTheDocument();
	});
});
