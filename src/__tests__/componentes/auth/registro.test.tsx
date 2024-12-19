import Registro from "@/components/auth/registro";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/auth/actions", () => ({
	default: vi.fn(),
}));

describe("Registro Component", () => {
	test("test_form_submission_success", () => {
		render(<Registro />);

		fireEvent.change(screen.getByPlaceholderText("John Doe"), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByPlaceholderText("johndoe"), {
			target: { value: "validUser" },
		});
		fireEvent.change(screen.getByPlaceholderText("correo@electronico.com"), {
			target: { value: "valid@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("contraseña"), {
			target: { value: "Valid123!" },
		});

		fireEvent.click(screen.getByRole("button", { name: /Crear Nueva Cuenta/i }));

		expect(
			screen.queryByText(/El nombre de usuario debe tener entre 3 y 20 caracteres/i),
		).not.toBeInTheDocument();
		expect(screen.queryByText(/El correo electrónico no es válido/i)).not.toBeInTheDocument();
		expect(
			screen.queryByText(/La contraseña debe tener al menos 8 caracteres/i),
		).not.toBeInTheDocument();
	});

	test("test_invalid_username_error", () => {
		render(<Registro />);

		fireEvent.change(screen.getByPlaceholderText("John Doe"), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByPlaceholderText("johndoe"), { target: { value: "us" } });
		fireEvent.change(screen.getByPlaceholderText("correo@electronico.com"), {
			target: { value: "valid@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("contraseña"), {
			target: { value: "Valid123!" },
		});

		fireEvent.click(screen.getByRole("button", { name: /Crear Nueva Cuenta/i }));

		expect(
			screen.getByText(/El nombre de usuario debe tener entre 3 y 20 caracteres/i),
		).toBeInTheDocument();
	});
});
