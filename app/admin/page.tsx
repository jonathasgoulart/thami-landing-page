'use client'

import { useActionState } from 'react';
import { login } from './actions';

const initialState = {
    message: '',
};


export default function AdminLogin() {
    const [state, formAction] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card p-8 rounded-lg border border-primary/20 backdrop-blur-sm">
                <h1 className="text-3xl font-serif text-primary mb-2 text-center">ADMIN THAMI</h1>
                <p className="text-foreground/60 text-center mb-8 text-sm">Acesso restrito para gerenciamento</p>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-accent uppercase tracking-wider mb-2">
                            Senha de Acesso
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="w-full bg-black/20 border border-primary/30 rounded px-4 py-3 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.message && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-200 text-sm text-center">
                            {state.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-serif tracking-wider py-3 rounded hover:bg-primary/90 transition-colors uppercase"
                    >
                        Entrar no Painel
                    </button>
                </form>
            </div>
        </div>
    );
}
