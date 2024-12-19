import ListaNotificaciones from "@/components/notificaciones/lista-notificaciones";
import { Notificacion } from "@/lib/notificaciones/types";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/notificaciones/actions", () => ({
	deleteNotificacion: vi.fn(),
	deleteAllNotificaciones: vi.fn(),
}));

describe("ListaNotificaciones Component", () => {
	const mockNotificaciones: Notificacion[] = [
		{
			id: "1",
			notificacion: "Notification 1",
			created_at: new Date().toISOString(),
			tarea: {
				titulo: "Tarea 1",
				estado: "Abierto",
				slug: "tarea-1",
				entorno: {
					slug: "proyecto-1",
					entorno: {
						slug: "entorno-2",
						equipo: {
							slug: "equipo-1",
						},
					},
				},
			},
		},
		{
			id: "2",
			notificacion: "Notification 2",
			created_at: new Date().toISOString(),
			tarea: {
				titulo: "Tarea 2",
				estado: "Completado",
				slug: "tarea-2",
				entorno: {
					slug: "proyecto-1",
					entorno: {
						slug: "entorno-2",
						equipo: {
							slug: "equipo-1",
						},
					},
				},
			},
		},
	];

	it("test_handle_single_notification_deletion", () => {
		render(<ListaNotificaciones notificaciones={mockNotificaciones} />);

		const deleteButtons = screen.getAllByText("Eliminar");
		fireEvent.click(deleteButtons[0]);

		expect(screen.queryByText("Notification 1")).not.toBeInTheDocument();
		expect(screen.getByText("Notification 2")).toBeInTheDocument();
	});
});
