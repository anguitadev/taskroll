export type Documento = {
	created_at: string;
	destinatario: string | null;
	entorno: string | null;
	id: string;
	nombre: string;
	propietario: string;
	url: string;
};

export type DocumentoEntorno = {
	created_at: string;
	destinatario: string | null;
	entorno: {
		slug: string;
		nombre: string;
		entorno: {
			slug: string;
			nombre: string;
			entorno: {
				slug: string;
				nombre: string;
			};
		} | null;
	} | null;
	id: string;
	nombre: string;
	propietario: string;
	url: string;
};

export type DocumentosEquipo = {
	created_at: string;
	destinatario: string | null;
	entorno: {
		slug: string;
		nombre: string;
		entorno: {
			slug: string;
			nombre: string;
			entorno: {
				slug: string;
				nombre: string;
			};
		} | null;
	} | null;
	id: string;
	nombre: string;
	propietario: string;
	url: string;
};

export type Nomina = {
			created_at: string;
			destinatario: string | null;
			entorno: {
				slug: string;
				nombre: string;
				entorno: {
					slug: string;
					nombre: string;
					entorno: {
						slug: string;
						nombre: string;
					};
				} | null;
			} | null;
			id: string;
			nombre: string;
			propietario: string;
			url: string;
	  };