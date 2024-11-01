import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <div className='h-screen justify-center flex flex-col gap-4 font-sans text-center'>
            <p>Hola {data.user.email}</p>
            <form action="/signout" method="post">
                <button className='py-2 px-4 bg-indigo-500 border border-indigo-600 rounded font-medium' type="submit">
                    Cerrar Sesión
                </button>
            </form>
        </div>
    );
}