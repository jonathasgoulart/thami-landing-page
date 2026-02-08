'use client'

import { useActionState } from 'react';
import { updateHero } from '@/app/admin/dashboard/actions';

export function HeroForm({ data }: { data: any }) {
    const [state, formAction] = useActionState(updateHero, { message: '' });

    return (
        <div className="bg-card border border-white/5 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-primary">Edição: Hero (Topo)</h2>
                {state?.message && (
                    <span className="text-sm px-3 py-1 rounded bg-green-900/30 text-green-400 border border-green-900/50 animate-pulse">
                        {state.message}
                    </span>
                )}
            </div>

            <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Texto Superior (Eyebrow)</label>
                    <input name="eyebrow" defaultValue={data.eyebrow} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Título Principal</label>
                    <input name="title" defaultValue={data.title} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none font-bold" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Artista Principal</label>
                    <input name="artist" defaultValue={data.artist} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Participação (Feat)</label>
                    <input name="feat" defaultValue={data.feat} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Data de Lançamento</label>
                    <input name="releaseDate" defaultValue={data.releaseDate} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Botão (CTA) Texto</label>
                    <input name="ctaText" defaultValue={data.ctaText} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Botão (CTA) Link</label>
                    <input name="ctaLink" type="url" defaultValue={data.ctaLink} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-white/5 flex justify-end">
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded font-medium transition-colors">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
