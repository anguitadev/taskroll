import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();
    if (data.user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex flex-col h-screen lg:my-0 lg:grid lg:grid-cols-2 font-sans">
            <div
                className="hidden p-12 bg-center lg:flex flex-col justify-between"
                style={{ backgroundImage: "url('/auth/auth-bg.webp')" }}>
                <Link href="/" className="text-xl font-semibold w-fit">
                    Taskroll
                </Link>
                <div className="font-medium flex flex-col gap-4">
                    <span className="text-2xl">
                        “Taskroll me ha ahorrado incontables horas de trabajo y me ha ayudado a
                        entregar productos más rápido que nunca.”
                    </span>
                    <span className="text-xl text-neutral-300">John Doe</span>
                </div>
            </div>
            <Link href="/" className="lg:hidden mt-12 text-center text-3xl font-semibold">
                Taskroll
            </Link>
            <div className="mt-24 mx-auto lg:m-auto md:w-96 w-screen p-4">{children}</div>
        </div>
    );
}
