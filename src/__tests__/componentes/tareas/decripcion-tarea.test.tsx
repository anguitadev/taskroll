import DescripcionTarea from "@/components/tareas/descripcion-tarea";
import { updateDescripcionTarea } from "@/lib/tareas/actions";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/tareas/actions", () => ({
	updateDescripcionTarea: vi.fn(),
}));

describe("DescripcionTarea Component", () => {
	const descripcion = "Initial description";
	const idTarea = "123";

	test("test_toggle_edit_mode", () => {
		const { getByText, queryByText } = render(
			<DescripcionTarea descripcion={descripcion} idTarea={idTarea} />,
		);

		const editButton = getByText("Editar Descripción");
		fireEvent.click(editButton);

		expect(queryByText("Guardar Descripción")).toBeInTheDocument();
		expect(queryByText("Editar Descripción")).not.toBeInTheDocument();

		fireEvent.click(editButton);

		expect(queryByText("Editar Descripción")).toBeInTheDocument();
		expect(queryByText("Guardar Descripción")).not.toBeInTheDocument();
	});

	test("test_update_task_description", () => {
		const { getByText, getByRole } = render(
			<DescripcionTarea descripcion={descripcion} idTarea={idTarea} />,
		);

		const editButton = getByText("Editar Descripción");
		fireEvent.click(editButton);

		const textarea = getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "Descripción actualizada" } });

		const saveButton = getByText("Guardar Descripción");
		fireEvent.click(saveButton);

		expect(updateDescripcionTarea).toHaveBeenCalledWith(idTarea, "Descripción actualizada");
	});
});
