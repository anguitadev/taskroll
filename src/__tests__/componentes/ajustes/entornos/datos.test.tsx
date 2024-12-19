import DatosEntorno from "@/components/ajustes/entornos/datos";
import { updateEntornoById } from "@/lib/entornos/actions";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/entornos/actions", () => ({
	updateEntornoById: vi.fn(),
	deleteEntornoById: vi.fn(),
}));

describe("DatosEntorno Component", () => {
	const entorno = {
		id: "1",
		nombre: "Test Entorno",
		color: "bg-red-600",
		descripcion: "Test Description",
		entorno: "123",
		equipo: "123",
		propietario: "123",
		slug: "test-entorno",
	};
	const propietario = {
		nombre_completo: "John Doe",
		color: "bg-blue-600",
		email: "mail@mail.com",
		nombre_usuario: "johndoe",
		id: "123",
		puesto: "Developer",
	};
	const isAdmin = true;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("test_handleUpdate_success", async () => {
		render(<DatosEntorno entorno={entorno} propietario={propietario} isAdmin={isAdmin} />);

		const updateButton = screen.getByText("Actualizar");
		fireEvent.click(updateButton);

		expect(updateEntornoById).toHaveBeenCalledWith(
			entorno.id,
			entorno.nombre,
			entorno.color,
			entorno.descripcion,
		);
	});

	it("test_handleUpdate_emptyNombre", async () => {
		render(
			<DatosEntorno
				entorno={{ ...entorno, nombre: "" }}
				propietario={propietario}
				isAdmin={isAdmin}
			/>,
		);

		const updateButton = screen.getByText("Actualizar");
		fireEvent.click(updateButton);

		const errorMessage = await screen.findByText("El nombre del entorno no puede estar vacío.");
		expect(errorMessage).toBeInTheDocument();
	});
});
