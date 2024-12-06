import {
	Body,
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

export const CorreoNotificacion = ( {nombre_completo, notificacion} : {nombre_completo?: string; notificacion?: string}) => {
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
								width="250"
								height="auto"
								alt="Taskroll"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							<strong>Has recibido una nueva notificación</strong>
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Hello {nombre_completo},
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							{notificacion}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default CorreoNotificacion;
