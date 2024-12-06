import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

const baseUrl = process.env.TASKROLL_URL ? `https://${process.env.TASKROLL_URL}` : "";

export const CorreoNotificacion = ({
	nombre_completo,
	notificacion,
	tareaUrl,
}: {
	nombre_completo?: string;
	notificacion?: string;
	tareaUrl?: string;
}) => {
	const previewText = "Tienes una nueva notificación.";

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white px-2 font-sans">
					<Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Section className="mt-[32px]">
							<Img
								src={`${baseUrl}/logo.png`}
								width="200"
								height="97"
								alt="Taskroll"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							<strong>Has recibido una nueva notificación</strong>
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Hola <strong>{nombre_completo}</strong>,
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							{notificacion}
						</Text>
						<Section className="mb-[32px] mt-[32px] text-center">
							<Button
								className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={tareaUrl}
							>
								Ver Tarea
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default CorreoNotificacion;
