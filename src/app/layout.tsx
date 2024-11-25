import { ThemeProvider } from "@/components/theme/theme-provider";
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
					src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.16/mammoth.browser.min.js"
					integrity="sha512-hXFbhlByvaKQUnA8YLVmee6gVnmmL5RMx2GVnxuTBxMrVegwIN/1d2eZ3ICNzw0MViUotNtZEdgPW+Dq+kv4oQ=="
					crossOrigin="anonymous"
				></script>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-neutral-200 antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
