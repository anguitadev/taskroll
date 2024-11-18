import AjustesDelPerfil from "@/components/ajustes/perfil";
import { createClient } from "@/utils/supabase/server";

interface User {
	nombre_usuario: string;
	nombre_completo: string;
	color: string;
	puesto: string | null;
	email: string | undefined;
}

export default async function AjustesCuentaPerfil() {

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data: infoUsuario } = await supabase
		.from("Usuarios")
		.select("nombre_usuario, nombre_completo, color, puesto")
		.eq("id", user!.id);

	const usuario = infoUsuario!.pop() as User;

	usuario.email = user!.email;

	return (
		<>
			<div className="border-b border-neutral-800 p-3 text-center">
				<span>Ajustes del Perfil</span>
			</div>
			<div className="w-full p-2 md:mx-auto md:w-[640px] overflow-y-scroll  max-h-[calc(100vh-70px)]">
				<div className="mt-8 md:mt-12 flex flex-col p-6">
					<h1 className="text-3xl font-semibold">Perfil</h1>
					<span className="text-sm text-neutral-400">
						Aquí puedes realizar cambios sobre tu perfil.
					</span>
				</div>
				<AjustesDelPerfil {...usuario} />
			</div>
		</>
	);
}
