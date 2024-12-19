import IniciarSesion from "@/components/auth/iniciar-sesion";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useSearchParams: () => ({
		get: vi.fn().mockReturnValue(null),
	}),
}));

describe("IniciarSesion Component", () => {
	test("test_invalid_email_format_shows_error", async () => {
		render(<IniciarSesion />);

		const emailInput = screen.getByPlaceholderText("correo@electronico.com");
		fireEvent.change(emailInput, { target: { value: "invalid-email" } });

		await new Promise(r => setTimeout(r, 1100));

		const errorMessage = screen.getByText("El correo electrónico no es válido.");
		expect(errorMessage).toBeInTheDocument();
	});
});
