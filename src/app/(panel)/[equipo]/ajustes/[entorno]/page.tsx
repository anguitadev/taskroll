import DatosEntorno from "@/components/ajustes/entornos/datos";
import TablaUsuarios from "@/components/ajustes/tabla-usuarios";
import { Tables } from "@/db.types";
import {
	getEntornoProyectoBySlug,
	getUsuario,
	getUsuarioById,
	getUsuariosByEntornoId,
	isEntornoAdmin,
} from "@/lib/data";
import { notFound } from "next/navigation";

type Params = Promise<{ entorno: string }>;

export default async function AjustesEntorno(props: { params: Params }) {
	const params = await props.params;
	const entornoSlug = params.entorno;

	const entorno = await getEntornoProyectoBySlug(entornoSlug);

	if (!entorno) return notFound();

	const isAdmin = await isEntornoAdmin(entorno.id);

	if (!isAdmin) return notFound();

	const propietario: Tables<"Usuarios"> = await getUsuarioById(entorno.propietario);

	const usuariosEntorno = await getUsuariosByEntornoId(entorno.id);

	const usuarioLoggeado = await getUsuario();

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Ajustes de {entorno.nombre}</span>
			</div>
			<div className="max-h-[calc(100vh-70px)] w-full overflow-y-scroll">
				<div className="m-auto flex w-[640px] flex-col rounded border border-neutral-700 bg-neutral-800 p-4 md:mt-8">
					<h1 className="mb-4 text-3xl font-semibold">Datos</h1>
					<DatosEntorno entorno={entorno} propietario={propietario} />
				</div>
				<hr className="my-8 w-full border border-neutral-800" />
				<div className="p-8">
					<h1 className="mb-4 text-3xl font-semibold">Miembros:</h1>
					{usuarioLoggeado && usuariosEntorno && (
						<TablaUsuarios
							usuarios={usuariosEntorno}
							usuarioLoggeado={usuarioLoggeado.id}
						/>
					)}
				</div>
			</div>
		</>
	);
}
