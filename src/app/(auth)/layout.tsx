import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen grid grid-cols-2 items-stretch font-sans">
            <div className="p-12 bg-center flex flex-col justify-between" style={{ backgroundImage: "url('/auth/auth-bg.webp')" }} >
                <Link href="/" className="text-xl font-semibold w-fit">Taskroll</Link>
                <div className="font-medium flex flex-col gap-4">
                    <span className="text-2xl">“Taskroll me ha ahorrado incontables horas de trabajo y me ha ayudado a entregar productos más rápido que nunca.”</span>
                    <span className="text-xl text-neutral-300">John Doe</span>
                </div>
            </div>
            <div className="m-auto">
                {children}
            </div>
        </div >
    );
}