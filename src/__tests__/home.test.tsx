import Home from "@/app/page";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("Home Page", () => {
	test("renders Taskroll header link", () => {
		render(<Home />);
		const headerLink = screen.getByRole("link", { name: /taskroll/i });
		expect(headerLink).toBeInTheDocument();
	});

	test("renders navigation links", () => {
		render(<Home />);
		expect(screen.getByRole("link", { name: /^Inicio$/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /^Productividad$/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /^Marcajes$/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /^FAQs$/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /^Inicia Sesión$/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /^Regístrate$/i })).toBeInTheDocument();
	});

	test("renders main heading for features", () => {
		render(<Home />);
		const mainHeading = screen.getByRole("heading", {
			name: /todas las herramientas necesarias/i,
		});
		expect(mainHeading).toBeInTheDocument();
	});

	test("renders FAQ section and accordion", () => {
		render(<Home />);
		const faqHeading = screen.getByRole("heading", {
			name: /Preguntas Frecuentes/i,
		});
		expect(faqHeading).toBeInTheDocument();

		const accordionTrigger = screen.getByRole("button", {
			name: /¿Puedo acceder a la aplicación\?/i,
		});
		expect(accordionTrigger).toBeInTheDocument();
	});

	test("accordion toggles content on click", () => {
		render(<Home />);
		const trigger = screen.getByRole("button", {
			name: /¿Puedo acceder a la aplicación\?/i,
		});

		// El contenido no debería ser visible.
		expect(
			screen.queryByText(/La aplicación se encuentra en fase de desarrollo/i),
		).not.toBeInTheDocument();

		fireEvent.click(trigger);

		// Después de hacer click se muestra
		expect(
			screen.getByText(/La aplicación se encuentra en fase de desarrollo/i),
		).toBeInTheDocument();

		// Se hace click de nuevo para ocultarlo
		fireEvent.click(trigger);
		expect(
			screen.queryByText(/La aplicación se encuentra en fase de desarrollo/i),
		).not.toBeInTheDocument();
	});

	test("renders productivity heading", () => {
		render(<Home />);
		const productivityHeading = screen.getByRole("heading", {
			name: /Aumenta tu Capacidad Productiva/i,
		});
		expect(productivityHeading).toBeInTheDocument();
	});
});
