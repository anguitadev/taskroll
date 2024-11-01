import { login, signup } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User } from 'lucide-react'

export default async function LoginPage() {
    const supabase = await createClient()

    const { data } = await supabase.auth.getUser();
    if (data.user) {
        redirect('/dashboard')
    }

    return (
        <div className='flex flex-col text-center'>
            <h1 className="text-2xl font-semibold">Iniciar Sesión</h1>
            <span className='mt-2 text-neutral-400'>Introduce tu correo electrónico y contraseña</span>
            <form className='flex flex-col mt-8 gap-2'>
                <input className='py-2 px-4 rounded border border-neutral-800 bg-transparent' id="email" name="email" type="email" placeholder="correo@electronico.com" required />
                <input className='py-2 px-4 rounded border border-neutral-800 bg-transparent' id="password" name="password" type="password" placeholder="contraseña" required />
                <button formAction={login} className='py-2 px-4 bg-indigo-500 border border-indigo-600 rounded font-medium'>Iniciar Sesión</button>
                <div className="py-3 flex items-center text-sm before:flex-1 before:border-t before:me-6 after:flex-1 after:border-t after:ms-6 before:border-neutral-800 after:border-neutral-800 text-neutral-400">también puedes</div>
                <button disabled formAction={signup} className='py-3 px-4 border border-neutral-800 rounded font-medium flex flex-row items-center justify-center gap-2'><User className='size-5' />Crear Nueva Cuenta</button>
            </form>
        </div>
    )
}