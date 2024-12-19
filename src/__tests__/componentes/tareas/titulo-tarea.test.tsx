import TituloTarea from "@/components/tareas/titulo-tarea";
import { updateTituloTarea } from "@/lib/tareas/actions";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/tareas/actions", () => ({
	updateTituloTarea: vi.fn(),
}));

describe("TituloTarea Component", () => {
	const tituloTarea = "Titulo Tarea";
	const idTarea = "123";

	test("test_toggle_edit_mode", () => {
		const { getByText, getByRole } = render(
			<TituloTarea tituloTarea={tituloTarea} idTarea={idTarea} />,
		);

		const titleElement = getByText(tituloTarea);
		fireEvent.click(titleElement);

		const inputElement = getByRole("textbox");
		expect(inputElement).toBeInTheDocument();
		expect(inputElement).toHaveValue(tituloTarea);
	});

	test("test_update_task_title_on_blur", () => {
		const { getByText, getByRole } = render(
			<TituloTarea tituloTarea={tituloTarea} idTarea={idTarea} />,
		);

		const titleElement = getByText(tituloTarea);
		fireEvent.click(titleElement);

		const inputElement = getByRole("textbox");
		fireEvent.change(inputElement, { target: { value: "Título actualizado" } });
		fireEvent.blur(inputElement);

		expect(updateTituloTarea).toHaveBeenCalledWith(idTarea, "Título actualizado");
	});

	test("test_empty_title_input", () => {
		const { getByText, getByRole } = render(
			<TituloTarea tituloTarea={tituloTarea} idTarea={idTarea} />,
		);

		const titleElement = getByText(tituloTarea);
		fireEvent.click(titleElement);

		const inputElement = getByRole("textbox");
		fireEvent.change(inputElement, { target: { value: "" } });
		fireEvent.blur(inputElement);

		expect(inputElement).toHaveClass("border-red-500");
	});
});
