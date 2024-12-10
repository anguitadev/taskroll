import Perfil from "./perfil";

export default function NombreUsuario({
	usuario,
}: {
	usuario: {
		color: string;
		email: string;
		id: string;
		nombre_completo: string;
		nombre_usuario: string;
		puesto: string | null;
	};
}) {
	return (
		<>
			<button
				className="flex items-center gap-2 font-semibold"
				popoverTarget={"perfil-" + usuario.nombre_usuario}
			>
				<div
					className={
						"flex size-6 items-center justify-center rounded-full text-sm " +
						usuario.color
					}
				>
					{usuario.nombre_completo[0]}
				</div>
				{usuario.nombre_completo}
			</button>
			<Perfil usuario={usuario} />
		</>
	);
}
