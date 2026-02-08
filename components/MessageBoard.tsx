'use client'

import { useActionState } from 'react';
import { submitMessage } from '@/app/admin/dashboard/messages/actions';
import { motion } from 'framer-motion';
import { Send, Heart, Mail, MessageCircle, CornerDownRight } from 'lucide-react';

export function MessageBoard({ messages, contact }: { messages: any[], contact: any }) {
    const [state, formAction] = useActionState(submitMessage, { message: '' });

    // Filter approved messages (Auto-approved now, but filter just in case logic changes)
    const displayMessages = messages.filter(m => m.approved !== false);

    return (
        <section className="py-16 container mx-auto px-4" id="contato">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                {/* Left Side: Message Form + Contact */}
                <div className="space-y-12">

                    {/* Message Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-serif text-white flex items-center gap-2">
                                <Send size={18} className="text-accent" />
                                Deixe um Recado
                            </h3>
                            <p className="text-xs text-foreground/40">Sua mensagem aparecerá ao lado imediatamente.</p>
                        </div>

                        <form action={formAction} className="space-y-4">
                            <input
                                name="name"
                                placeholder="Seu Nome"
                                required
                                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                            />
                            <textarea
                                name="text"
                                placeholder="Escreva algo com carinho..."
                                required
                                rows={3}
                                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-white/20"
                            />

                            <button
                                type="submit"
                                className="mt-2 text-sm text-primary hover:text-white transition-colors font-medium flex items-center gap-2"
                            >
                                ENVIAR MENSAGEM →
                            </button>

                            {state.message && (
                                <p className={`text-xs ${state.message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                                    {state.message}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Contact / Hire Section */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6">
                        <h2 className="text-2xl font-serif text-primary">Contratação & Shows</h2>
                        <p className="text-foreground/80 text-sm leading-relaxed">{contact?.bookingText || 'Entre em contato para orçamentos:'}</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {contact?.whatsapp && (
                                <a
                                    href={`https://wa.me/${contact.whatsapp}`}
                                    target="_blank"
                                    className="flex-1 inline-flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20"
                                >
                                    <MessageCircle size={20} />
                                    WhatsApp
                                </a>
                            )}

                            {contact?.email && (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="flex-1 inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/10"
                                >
                                    <Mail size={20} />
                                    Email
                                </a>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Side: Display (Scrollable) */}
                <div className="bg-black/20 rounded-xl p-6 border border-white/5 h-full min-h-[500px] flex flex-col">
                    <h3 className="text-lg font-serif text-white/50 flex items-center gap-2 mb-6">
                        <Heart size={16} className="text-accent" />
                        Mural de Amor
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 max-h-[500px]">
                        {displayMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-lg py-12">
                                <p>Seja o primeiro a escrever!</p>
                            </div>
                        ) : (
                            displayMessages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white/5 p-5 rounded-lg border border-white/5 relative group hover:bg-white/10 transition-colors"
                                >
                                    <div className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors text-2xl font-serif">”</div>

                                    {/* Fan Message */}
                                    <p className="text-foreground/90 text-sm leading-relaxed mb-3 relative z-10">
                                        {msg.text}
                                    </p>

                                    <div className="flex items-center gap-2 border-t border-white/5 pt-3 mb-2">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{msg.name}</span>
                                        <span className="text-[10px] text-white/20">•</span>
                                        <span className="text-[10px] text-white/30">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {/* Artist Reply */}
                                    {msg.reply && (
                                        <div className="ml-4 mt-3 pl-4 border-l border-primary/30 flex flex-col gap-1 bg-primary/5 p-2 rounded-r">
                                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                                                <CornerDownRight size={10} /> Thami respondeu:
                                            </span>
                                            <p className="text-xs text-foreground/80 font-serif italic">
                                                "{msg.reply}"
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
