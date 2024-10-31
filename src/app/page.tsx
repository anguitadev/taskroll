'use client'

import { Rocket } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function showAlert() {
  alert("Próximamente...");
}

export default function Home() {
  return (
    <div className="max-w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-45%,rgba(120,119,198,0.3),rgba(255,255,255,0))] font-[family-name:var(--font-geist-sans)]">
      <header className="animate-in fade-in duration-700 bg-neutral-950/60 backdrop-blur-md border-b border-neutral-700 sticky top-0">
        <div className="max-w-6xl px-4 m-auto flex flex-row justify-between py-4 items-center">
          <a href="#" className="text-xl font-semibold">Taskroll</a>
          <nav>
            <ul className="flex flex-row gap-5 text-neutral-300 items-center">
              <a href="#" className='hidden md:inline'>Inicio</a>
              <a href="#productividad" className='hidden md:inline'>Productividad</a>
              <a href="#marcajes" className='hidden md:inline'>Marcajes</a>
              <a href="#faqs" className='hidden md:inline'>FAQs</a>
              <a href="#" className="md:border-l border-neutral-700 pl-5" onClick={showAlert}>Inicia Sesión</a>
              <a href="#" className="py-1 px-3 bg-indigo-500 rounded text-neutral-100 border border-indigo-600 hover:bg-indigo-600 transition" onClick={showAlert}>Regístrate</a>
            </ul>
          </nav>
        </div>
      </header>
      <div className="max-w-6xl px-4 m-auto flex flex-col pt-12 md:pt-24 animate-in fade-in duration-1000">
        <h1 className="max-w-2xl m-auto text-4xl text-center font-bold bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 inline-block text-transparent bg-clip-text">Todas las Herramientas Necesarias en una Aplicación</h1>
        <p className="mt-4 max-w-3xl m-auto text-center font-medium text-lg text-neutral-400">Entendemos lo dificil que puede ser adaptar tu equipo de trabajo a un entorno remoto.<br className="hidden md:block" />Ya no necesitas 10 aplicaciones diferentes. Taskroll está hecho a tu medida.</p>
        <a href="#" className="mt-6 py-1 px-3 bg-indigo-500 rounded text-neutral-100 border border-indigo-600 w-fit m-auto flex flex-row gap-2 items-center hover:bg-indigo-600 transition" onClick={showAlert}><Rocket className="size-5 stroke-neutral-100" />Empieza Ahora</a>
        <Image src="/landing/panel-control.webp"
          className="mt-24"
          width={1920}
          height={859}
          priority={true}
          alt="Panel de control" />
      </div>
      <div id="productividad" className="pt-12 md:pt-24 max-w-6xl px-4 mx-auto flex flex-col">
        <h1 className="max-w-2xl m-auto text-4xl text-center font-bold bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 inline-block text-transparent bg-clip-text">Aumenta tu Capacidad Productiva</h1>
        <p className="mt-4 max-w-3xl m-auto text-center font-medium text-lg text-neutral-400">Desde Taskroll puedes administrar diferentes equipos, entornos y proyectos.<br className="hidden md:block" />En cada uno de ellos podrás crear tareas.</p>
      </div>
      <div className="max-w-6xl px-4 m-auto grid pt-12 md:pt-24 gap-4 sm:grid-cols-2">
        <div className='bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col gap-2 p-6'>
          <span className='text-xl text-neutral-100 font-semibold'>Equipos</span>
          <span className='text-neutral-400 font-medium'>Entendemos que, independientemente del tamaño de tu empresa, los trabajadores se unen en diferentes equipos. Por este motivo, en Taskroll, puedes administrar equipos con diferentes entornos.</span>
        </div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col gap-2 p-6'>
          <span className='text-xl text-neutral-100 font-semibold'>Entornos</span>
          <span className='text-neutral-400 font-medium'>Taskroll es una herramienta que se adapta a tus necesidades. Puedes hacer con los entornos lo que quieras. Tratarlos como sub-equipos diferentes o como grupos de tareas para clientes.</span>
        </div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col gap-2 p-6'>
          <span className='text-xl text-neutral-100 font-semibold'>Proyectos</span>
          <span className='text-neutral-400 font-medium'>Dentro de cada entorno, puedes crear diferentes proyectos para administrar grupos de tareas que tienen algo en común. También puedes añadir usuarios específicos a cada proyecto.</span>
        </div>
        <div className='bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col gap-2 p-6'>
          <span className='text-xl text-neutral-100 font-semibold'>Tareas</span>
          <span className='text-neutral-400 font-medium'>Mantén el control de la productividad de tu equipo. Puedes conocer el tiempo exacto que tus empleados destinan a cada una de ellas y contestar a todas sus dudas desde el mismo panel.</span>
        </div>
      </div>
      <div id="marcajes" className="pt-12 md:pt-24 max-w-6xl px-4 m-auto flex flex-col">
        <h1 className="max-w-2xl m-auto text-4xl text-center font-bold bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 inline-block text-transparent bg-clip-text">Gestión de Marcajes y Nóminas</h1>
        <p className="mt-4 max-w-3xl m-auto text-center font-medium text-lg text-neutral-400">Nos adaptamos a la normativa española para gestionar horarios laborales<br className="hidden md:block" />y administrar nóminas de forma digital y sostenible.</p>
        <Image src="/landing/marcajes.webp"
          className="mt-24"
          width={1920}
          height={859}
          alt="Panel de marcajes" />
      </div>
      <div id="faqs" className='border border-t border-b border-neutral-800 bg-neutral-900 px-4'>
        <div className="max-w-6xl mx-auto flex flex-col pt-24">
          <h1 className="max-w-2xl mx-auto text-4xl text-center font-bold bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-300 inline-block text-transparent bg-clip-text">Preguntas Frecuentes</h1>
          <p className="mt-4 max-w-3xl mx-auto text-center font-medium text-lg text-neutral-400">Sí, lo sabemos, suena demasiado bien para ser verdad. Queremos escucharte<br className="hidden md:block" />y contestar a todas tus dudas. ¿Porqué no empezamos con estas?</p>
        </div>
        <Accordion type="single" collapsible className="max-w-4xl mx-auto my-12 md:my-24 text-xl">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Puedo acceder a la aplicación?</AccordionTrigger>
            <AccordionContent>La aplicación se encuentra en fase de desarrollo. Es por este motivo que tan solo unos pocos usuarios tienen acceso a ella. Tan pronto como se publiqué, estará abierta al registro de cualquier usuario.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Cuál es la fecha de publicación?</AccordionTrigger>
            <AccordionContent>La fecha exacta no está definida pero será a finales de Diciembre o principio de Enero.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>¿Por qué usar Taskroll?</AccordionTrigger>
            <AccordionContent>El problema de muchos equipos de desarrollo en empresas pequeñas es la división de herramientas y sistemas para llevar a cabo tareas básicas. La gestión administrativa se lleva a cabo en una plataforma, mientras que, para la comunicación, al igual que para la gestión de tareas, se utiliza otra distinta. Esta división hace al equipo menos eficiente, distrayendo al desarrollador de lo que en realidad importa. Con TaskRoll, los usuarios tan solo deben abrir una aplicación en la que pueden gestionar todo lo necesario y donde reciben todas las notificaciones importantes.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>¿Qué se puede hacer en Taskroll?</AccordionTrigger>
            <AccordionContent>Gestionar los perfiles de los empleados. Gestionar las nóminas de cada empleado de forma segura. Realizar marcajes diarios. Mantener un historial de los marcajes de cada empleado. Gestionar equipos de trabajo. Gestionar entornos de trabajo. Gestionar proyectos. Gestionar tareas. Gestionar los roles de los empleados en cada equipo/entorno/proyecto/tarea. Crear comentarios dentro de las tareas. Cambiar los estados de las tareas. Analizar los flujos de trabajo mediante gráficos.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <footer className='max-w-6xl px-4 m-auto flex flex-row justify-between py-4 items-center'>
        <span className="text-xl font-semibold">Taskroll</span>
        <span className='text-neutral-300'>Hecho por <a href="https://github.com/anguitadev" target="_blank">@anguitadev</a></span>
      </footer>
    </div>
  );
}
