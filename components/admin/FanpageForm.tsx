"use client";

import { useActionState } from 'react';
import { updateFanpage } from '@/app/admin/dashboard/actions';

export function FanpageForm({ content }: { content: any }) {
    const fanpage = content?.fanpage || {};
    const [state, formAction, isPending] = useActionState(updateFanpage, null);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg border border-white/5">
            <div>
                <h3 className="text-lg font-serif mb-4 text-primary">Configurações da Fanpage</h3>
                <p className="text-sm text-foreground/60 mb-6">Altere os dados básicos da sua página Fanfirst aqui.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm mb-1 text-foreground/80">Nome do Perfil</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={fanpage.name || "THAMI"}
                        className="w-full bg-background border border-white/10 rounded-md p-2 text-foreground"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1 text-foreground/80">Biografia do Perfil</label>
                    <textarea
                        name="bio"
                        defaultValue={fanpage.bio || "Obrigado por se juntar à minha página Fanfirst!\nAqui é onde compartilharei conteúdo exclusivo, trabalhos em andamento e atualizações especiais apenas para você! 💖"}
                        className="w-full bg-background border border-white/10 rounded-md p-2 text-foreground h-24"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1 text-foreground/80">Link do Spotify (Embed URL)</label>
                    <input
                        type="text"
                        name="spotifyUrl"
                        defaultValue={fanpage.spotifyUrl || "https://open.spotify.com/embed/artist/6fupiyOvfbI12eijANkwZL?utm_source=generator"}
                        className="w-full bg-background border border-white/10 rounded-md p-2 text-foreground"
                    />
                </div>
            </div>

            {state?.message && (
                <div className={`p-3 rounded-md text-sm ${state.message.includes('❌') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {state.message}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
            >
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </form>
    );
}
