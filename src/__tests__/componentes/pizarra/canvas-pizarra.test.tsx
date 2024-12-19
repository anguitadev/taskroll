import CanvasPizarra from "@/components/pizarra/canvas-pizarra";
import { updatePizarra } from "@/lib/pizarras/actions";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/pizarras/actions", () => ({
	updatePizarra: vi.fn(),
}));

describe("CanvasPizarra Component", () => {
	const contenido = "Initial content";
	const entorno = "test-environment";

	test("test_toggle_edit_view_mode", () => {
		const { getByText } = render(<CanvasPizarra contenido={contenido} entorno={entorno} />);

		const button = getByText("Editar Pizarra");
		fireEvent.click(button);

		expect(getByText("Guardar Pizarra")).toBeInTheDocument();

		fireEvent.click(button);

		expect(getByText("Editar Pizarra")).toBeInTheDocument();
	});

	test("test_update_content_on_save", () => {
		const { getByText, getByDisplayValue } = render(
			<CanvasPizarra contenido={contenido} entorno={entorno} />,
		);

		const button = getByText("Editar Pizarra");
		fireEvent.click(button);

		const textarea = getByDisplayValue(contenido);
		fireEvent.change(textarea, { target: { value: "Contenido actualizado" } });

		fireEvent.click(getByText("Guardar Pizarra"));

		expect(updatePizarra).toHaveBeenCalledWith(entorno, "Contenido actualizado");
	});
});
