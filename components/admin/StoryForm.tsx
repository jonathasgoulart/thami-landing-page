'use client'

import { useActionState } from 'react';
import { updateStory } from '@/app/admin/dashboard/actions';

export function StoryForm({ data }: { data: any }) {
    const [state, formAction] = useActionState(updateStory, { message: '' });

    return (
        <div className="bg-card border border-white/5 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-primary">Edição: História (Carta)</h2>
                {state?.message && (
                    <span className="text-sm px-3 py-1 rounded bg-green-900/30 text-green-400 border border-green-900/50 animate-pulse">
                        {state.message}
                    </span>
                )}
            </div>

            <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Título da Seção</label>
                    <input name="title" defaultValue={data.title} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none font-serif text-lg" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Texto da Carta (Suporta HTML simples)</label>
                    <textarea
                        name="body"
                        defaultValue={data.body}
                        rows={8}
                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none font-serif leading-relaxed"
                    />
                    <p className="text-xs text-foreground/40">Dica: Use &lt;p&gt; para parágrafos e &lt;strong&gt; para negrito.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Assinatura</label>
                    <input name="signature" defaultValue={data.signature} className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded font-medium transition-colors">
                        Salvar História
                    </button>
                </div>
            </form>
        </div>
    );
}
