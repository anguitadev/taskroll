import Perfil from "@/components/ajustes/usuarios/perfil";
import { getNominasByUsuarioId } from "@/lib/documentos/data-client";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/documentos/data-client", () => ({
	getNominasByUsuarioId: vi.fn(),
}));

vi.mock("@/lib/auth/data-client", () => ({
	getUsuario: vi.fn(),
}));

describe("Perfil Component", () => {
	const mockUsuario = {
		color: "bg-blue-600",
		email: "johnd@mail.com",
		id: "123",
		nombre_completo: "John Doe",
		nombre_usuario: "johnd",
		puesto: "Developer",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("test_fetch_and_display_nominas", async () => {
		const mockNominas = [
			{
				created_at: "2023-10-01",
				destinatario: null,
				entorno: null,
				id: "nomina1",
				nombre: "Nomina Octubre",
				propietario: "123",
				url: "http://example.com/nomina1",
			},
		];

		(getNominasByUsuarioId as Mock).mockResolvedValue(mockNominas);

		render(<Perfil usuario={mockUsuario} />);

		fireEvent.click(screen.getByText("Ver Nóminas"));

		expect(await screen.findByText("Nomina Octubre")).toBeInTheDocument();
	});
});
