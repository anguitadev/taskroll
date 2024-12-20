import { ThemeProvider } from "@/components/theme/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Taskroll | Gestión de empleados y tareas",
	description:
		"Taskroll | Entendemos lo dificil que puede ser adaptar tu equipo de trabajo a un entorno remoto. Ya no necesitas 10 aplicaciones diferentes. Taskroll está hecho a tu medida.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es-ES" className="scroll-smooth">
			<head>
				<script
					defer
					src="https://cloud.umami.is/script.js"
					data-website-id="827f46f8-12bd-416d-a854-7d3619e5fcc5"
				></script>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-neutral-200 antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
				>
					{children}
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	);
}
