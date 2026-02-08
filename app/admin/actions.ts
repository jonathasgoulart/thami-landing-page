'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password');

    // Hardcoded password for Phase 1
    if (password === 'thami2026') {
        // Set cookie valid for 1 week
        // Next.js 15: cookies() is async
        const cookieStore = await cookies();

        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        redirect('/admin/dashboard');
    }

    return { message: 'Senha incorreta' };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin');
}
