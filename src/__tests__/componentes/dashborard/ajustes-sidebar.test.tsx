import AjustesSidebar from "@/components/dashboard/ajustes-sidebar";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("AjustesSidebar Component", () => {
	it("test_display_admin_environments", () => {
		const mockEntornos = [
			{
				Entornos: {
					id: "1",
					entorno: null,
					equipo: "equipo1",
					slug: "env1",
					nombre: "Entorno 1",
					color: "bg-red-600",
					descripcion: null,
					propietario: "propietario1",
				},
				admin: true,
			},
			{
				Entornos: {
					id: "2",
					entorno: "1",
					equipo: "equipo1",
					slug: "proyecto1",
					nombre: "Proyecto 1",
					color: "bg-blue-600",
					descripcion: "Project Description",
					propietario: "propietario2",
				},
				admin: true,
			},
		];

		render(
			<AjustesSidebar
				className=""
				equipo={{ id: "equipo1", nombre: "Equipo 1", slug: "equipo1" }}
				isAdmin={true}
				entornos={mockEntornos}
			/>,
		);

		expect(screen.getByText("Entorno 1")).toBeInTheDocument();
		expect(screen.getByText("Proyecto 1")).toBeInTheDocument();
	});

	it("test_no_environments_provided", () => {
		render(
			<AjustesSidebar
				className=""
				equipo={{ id: "equipo1", nombre: "Equipo 1", slug: "equipo1" }}
				isAdmin={true}
				entornos={[]}
			/>,
		);

		expect(screen.queryByText("Entornos")).not.toBeInTheDocument();
	});
});
