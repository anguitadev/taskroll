import NuevoUsuario from "@/components/ajustes/nuevo-usuario";
import { addUsuarioToEquipo } from "@/lib/entornos/actions";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/entornos/actions", () => ({
	addUsuarioToEquipo: vi.fn(),
	addUsuarioToEntorno: vi.fn(),
}));

describe("NuevoUsuario Component", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("test_add_user_to_team_success", async () => {
		const equipoSlug = "team-slug";
		const nombreusuario = "testuser";

		render(<NuevoUsuario equipoSlug={equipoSlug} />);

		const input = screen.getByPlaceholderText("nombreusuario");
		fireEvent.change(input, { target: { value: nombreusuario } });

		const button = screen.getByText("Añadir");
		fireEvent.click(button);

		expect(addUsuarioToEquipo).toHaveBeenCalledWith(nombreusuario, equipoSlug);
		await screen.findByText("Añadir nuevo usuario al equipo");
	});
});
