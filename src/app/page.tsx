import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="max-w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-45%,rgba(120,119,198,0.3),rgba(255,255,255,0))] font-[family-name:var(--font-geist-sans)]">
			<header className="sticky top-0 border-b border-neutral-700 bg-neutral-950/60 backdrop-blur-md duration-700 animate-in fade-in">
				<div className="m-auto flex max-w-6xl flex-row items-center justify-between px-4 py-4">
					<a href="#" className="text-xl font-semibold">
						Taskroll
					</a>
					<nav>
						<ul className="flex flex-row items-center gap-5 text-neutral-300">
							<a href="#" className="hidden md:inline">
								Inicio
							</a>
							<a href="#productividad" className="hidden md:inline">
								Productividad
							</a>
							<a href="#marcajes" className="hidden md:inline">
								Marcajes
							</a>
							<a href="#faqs" className="hidden md:inline">
								FAQs
							</a>
							<Link href="/login" className="border-neutral-700 pl-5 md:border-l">
								Inicia Sesión
							</Link>
							<Link
								href="/signup"
								className="rounded border border-indigo-600 bg-indigo-500 px-3 py-1 text-neutral-100 transition hover:bg-indigo-600"
							>
								Regístrate
							</Link>
						</ul>
					</nav>
				</div>
			</header>
			<div className="m-auto flex max-w-6xl flex-col px-4 pt-12 duration-1000 animate-in fade-in md:pt-24">
				<h1 className="m-auto inline-block max-w-2xl bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent">
					Todas las Herramientas Necesarias en una Aplicación
				</h1>
				<p className="m-auto mt-4 max-w-3xl text-center text-lg font-medium text-neutral-400">
					Entendemos lo dificil que puede ser adaptar tu equipo de trabajo a un entorno
					remoto.
					<br className="hidden md:block" />
					Ya no necesitas 10 aplicaciones diferentes. Taskroll está hecho a tu medida.
				</p>
				<Link
					href="/signup"
					className="m-auto mt-6 flex w-fit flex-row items-center gap-2 rounded border border-indigo-600 bg-indigo-500 px-3 py-1 text-neutral-100 transition hover:bg-indigo-600"
				>
					<Rocket className="size-5 stroke-neutral-100" />
					Empieza Ahora
				</Link>
				<Image
					src="/landing/panel-control.webp"
					className="mt-24"
					width={1920}
					height={859}
					priority={true}
					alt="Panel de control"
				/>
			</div>
			<div id="productividad" className="mx-auto flex max-w-6xl flex-col px-4 pt-12 md:pt-24">
				<h1 className="m-auto inline-block max-w-2xl bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent">
					Aumenta tu Capacidad Productiva
				</h1>
				<p className="m-auto mt-4 max-w-3xl text-center text-lg font-medium text-neutral-400">
					Desde Taskroll puedes administrar diferentes equipos, entornos y proyectos.
					<br className="hidden md:block" />
					En cada uno de ellos podrás crear tareas.
				</p>
			</div>
			<div className="m-auto grid max-w-6xl gap-4 px-4 pt-12 sm:grid-cols-2 md:pt-24">
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
					<span className="text-xl font-semibold text-neutral-100">Equipos</span>
					<span className="font-medium text-neutral-400">
						Entendemos que, independientemente del tamaño de tu empresa, los
						trabajadores se unen en diferentes equipos. Por este motivo, en Taskroll,
						puedes administrar equipos con diferentes entornos.
					</span>
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
					<span className="text-xl font-semibold text-neutral-100">Entornos</span>
					<span className="font-medium text-neutral-400">
						Taskroll es una herramienta que se adapta a tus necesidades. Puedes hacer
						con los entornos lo que quieras. Tratarlos como sub-equipos diferentes o
						como grupos de tareas para clientes.
					</span>
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
					<span className="text-xl font-semibold text-neutral-100">Proyectos</span>
					<span className="font-medium text-neutral-400">
						Dentro de cada entorno, puedes crear diferentes proyectos para administrar
						grupos de tareas que tienen algo en común. También puedes añadir usuarios
						específicos a cada proyecto.
					</span>
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
					<span className="text-xl font-semibold text-neutral-100">Tareas</span>
					<span className="font-medium text-neutral-400">
						Mantén el control de la productividad de tu equipo. Puedes conocer el tiempo
						exacto que tus empleados destinan a cada una de ellas y contestar a todas
						sus dudas desde el mismo panel.
					</span>
				</div>
			</div>
			<div id="marcajes" className="m-auto flex max-w-6xl flex-col px-4 pt-12 md:pt-24">
				<h1 className="m-auto inline-block max-w-2xl bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent">
					Gestión de Marcajes y Nóminas
				</h1>
				<p className="m-auto mt-4 max-w-3xl text-center text-lg font-medium text-neutral-400">
					Nos adaptamos a la normativa española para gestionar horarios laborales
					<br className="hidden md:block" />y administrar nóminas de forma digital y
					sostenible.
				</p>
				<Image
					src="/landing/marcajes.webp"
					className="mt-24"
					width={1920}
					height={859}
					alt="Panel de marcajes"
				/>
			</div>
			<div
				id="faqs"
				className="border border-b border-t border-neutral-800 bg-neutral-900 px-4"
			>
				<div className="mx-auto flex max-w-6xl flex-col pt-24">
					<h1 className="mx-auto inline-block max-w-2xl bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent">
						Preguntas Frecuentes
					</h1>
					<p className="mx-auto mt-4 max-w-3xl text-center text-lg font-medium text-neutral-400">
						Sí, lo sabemos, suena demasiado bien para ser verdad. Queremos escucharte
						<br className="hidden md:block" />y contestar a todas tus dudas. ¿Porqué no
						empezamos con estas?
					</p>
				</div>
				<Accordion
					type="single"
					collapsible
					className="mx-auto my-12 max-w-4xl text-xl md:my-24"
				>
					<AccordionItem value="item-1">
						<AccordionTrigger>¿Puedo acceder a la aplicación?</AccordionTrigger>
						<AccordionContent>
							La aplicación se encuentra en fase de desarrollo. Es por este motivo que
							tan solo unos pocos usuarios tienen acceso a ella. Tan pronto como se
							publiqué, estará abierta al registro de cualquier usuario.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>¿Cuál es la fecha de publicación?</AccordionTrigger>
						<AccordionContent>
							La fecha exacta no está definida pero será a finales de Diciembre o
							principio de Enero.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger>¿Por qué usar Taskroll?</AccordionTrigger>
						<AccordionContent>
							El problema de muchos equipos de desarrollo en empresas pequeñas es la
							división de herramientas y sistemas para llevar a cabo tareas básicas.
							La gestión administrativa se lleva a cabo en una plataforma, mientras
							que, para la comunicación, al igual que para la gestión de tareas, se
							utiliza otra distinta. Esta división hace al equipo menos eficiente,
							distrayendo al desarrollador de lo que en realidad importa. Con
							TaskRoll, los usuarios tan solo deben abrir una aplicación en la que
							pueden gestionar todo lo necesario y donde reciben todas las
							notificaciones importantes.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-4">
						<AccordionTrigger>¿Qué se puede hacer en Taskroll?</AccordionTrigger>
						<AccordionContent>
							Gestionar los perfiles de los empleados. Gestionar las nóminas de cada
							empleado de forma segura. Realizar marcajes diarios. Mantener un
							historial de los marcajes de cada empleado. Gestionar equipos de
							trabajo. Gestionar entornos de trabajo. Gestionar proyectos. Gestionar
							tareas. Gestionar los roles de los empleados en cada
							equipo/entorno/proyecto/tarea. Crear comentarios dentro de las tareas.
							Cambiar los estados de las tareas. Analizar los flujos de trabajo
							mediante gráficos.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<footer className="m-auto flex max-w-6xl flex-row items-center justify-between px-4 py-4">
				<span className="text-xl font-semibold">Taskroll</span>
				<span className="text-neutral-300">
					Hecho por{" "}
					<a href="https://github.com/anguitadev" target="_blank">
						@anguitadev
					</a>
				</span>
			</footer>
		</div>
	);
}
