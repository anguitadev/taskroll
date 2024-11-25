"use client";

import { DocumentViewer } from "react-documents";

export default function Visualizador({documento}: {documento: string}) {
	return (
		<>
			<DocumentViewer
				className="grow rounded-lg border border-neutral-700 bg-neutral-800"
				queryParams="hl=es"
				url={"https://utfs.io/f/"+documento}
			/>
		</>
	);
}
