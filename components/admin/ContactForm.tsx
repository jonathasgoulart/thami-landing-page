'use client'

import { useActionState } from 'react';
import { updateContact } from '@/app/admin/dashboard/actions';
import { Instagram, Youtube, Twitter, Music2, Share2, Mail, MessageCircle } from 'lucide-react';

export function ContactForm({ data }: { data: any }) {
    const [state, formAction] = useActionState(updateContact, { message: '' });

    return (
        <div className="bg-card border border-white/5 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-primary">Contato & Redes Sociais</h2>
                {state?.message && (
                    <span className="text-sm px-3 py-1 rounded bg-green-900/30 text-green-400 border border-green-900/50 animate-pulse">
                        {state.message}
                    </span>
                )}
            </div>

            <form action={formAction} className="space-y-8">

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={16} /> Contato Profissional
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-accent opacity-70">Email</label>
                            <input
                                name="email"
                                defaultValue={data?.email}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="ex: contato@thami.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-accent opacity-70">WhatsApp (Números)</label>
                            <input
                                name="whatsapp"
                                defaultValue={data?.whatsapp}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="ex: 5511999999999"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-accent opacity-70">Texto de Chamada (Booking)</label>
                        <input
                            name="bookingText"
                            defaultValue={data?.bookingText}
                            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="ex: Entre em contato para shows:"
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                        <Share2 size={16} /> Redes Sociais (Links Completos)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-accent opacity-70 flex items-center gap-2">
                                <Music2 size={14} /> Spotify URL
                            </label>
                            <input
                                name="spotify"
                                defaultValue={data?.spotify}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://open.spotify.com/..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-accent opacity-70 flex items-center gap-2">
                                <Instagram size={14} /> Instagram URL
                            </label>
                            <input
                                name="instagram"
                                defaultValue={data?.instagram}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-accent opacity-70 flex items-center gap-2">
                                <Youtube size={14} /> YouTube URL
                            </label>
                            <input
                                name="youtube"
                                defaultValue={data?.youtube}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-accent opacity-70 flex items-center gap-2">
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                Twitter / X URL
                            </label>
                            <input
                                name="twitter"
                                defaultValue={data?.twitter}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-accent opacity-70 flex items-center gap-2">
                                {/* TikTok Icon Placeholder */}
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.55-1.1-.17-.15-.47-.42-1-.87v7.65c0 2.25-1.11 4.28-2.98 5.4-2.14 1.28-4.9.98-6.73-.72-1.35-1.27-1.89-3.26-1.39-5.07.72-2.58 3.2-4.18 5.8-3.76v4.05c-1.18-.32-2.45.32-2.91 1.46-.35.85-.05 1.86.68 2.4.98.74 2.46.54 3.2-.4.49-.63.74-1.43.71-2.22V.02h.47z" /></svg>
                                TikTok URL
                            </label>
                            <input
                                name="tiktok"
                                defaultValue={data?.tiktok}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://tiktok.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded font-medium transition-colors">
                        Salvar Tudo
                    </button>
                </div>
            </form>
        </div>
    );
}
