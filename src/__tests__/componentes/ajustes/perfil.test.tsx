import AjustesDelPerfil from "@/components/ajustes/perfil";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/auth/actions", () => ({
	updateUsuario: vi.fn().mockResolvedValue(true),
}));

describe("AjustesDelPerfil Component", () => {
	const mockUser = {
		id: "1",
		color: "bg-red-600",
		nombre_completo: "John Doe",
		nombre_usuario: "johnd",
		puesto: "Developer",
		email: "johnd@mail.com",
	};

	test("test_update_user_profile_success", async () => {
		render(<AjustesDelPerfil usuario={mockUser} />);

		fireEvent.change(screen.getByLabelText(/Nombre Completo/i), {
			target: { value: "John Doe Updated" },
		});
		fireEvent.click(screen.getByRole("button", { name: /Actualizar/i }));

		expect(await screen.findByText(/Perfil actualizado correctamente./i)).toBeInTheDocument();
	});

	test("test_empty_nombre_completo_error", async () => {
		render(<AjustesDelPerfil usuario={mockUser} />);

		fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: "" } });
		fireEvent.click(screen.getByRole("button", { name: /Actualizar/i }));

		expect(await screen.findByText(/Por favor, introduce tu nombre./i)).toBeInTheDocument();
	});
});
