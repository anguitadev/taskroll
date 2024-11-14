interface Marcaje {
	entrada: string;
	salida: string | null;
	entrada_2: string | null;
	salida_2: string | null;
}

export function diferenciaTiempo(marcaje: Marcaje): string {
	let diferenciaMs = 0;

	if (marcaje.salida) {
		diferenciaMs = new Date(marcaje.salida).getTime() - new Date(marcaje.entrada).getTime();
	}

	if (marcaje.entrada_2 && marcaje.salida_2) {
		diferenciaMs +=
			new Date(marcaje.salida_2).getTime() - new Date(marcaje.entrada_2).getTime();
	}

	const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
	const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
	const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

	const horasStr = horas.toString().padStart(2, "0");
	const minutosStr = minutos.toString().padStart(2, "0");
	const segundosStr = segundos.toString().padStart(2, "0");

	if (diferenciaMs > 0) {
		return `${horasStr}:${minutosStr}:${segundosStr}`;
	} else {
        return "";
    }
}
