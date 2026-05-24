'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Youtube, Instagram, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Rio2cModalProps {
    contact: {
        spotify?: string;
        youtube?: string;
        instagram?: string;
        whatsapp?: string;
    }
}

export function Rio2cModal({ contact }: Rio2cModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Hydration guard: check localStorage only on the client
        const dismissed = localStorage.getItem('rio2c_popup_dismissed');
        if (!dismissed) {
            setIsOpen(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('rio2c_popup_dismissed', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    const hasLink = (url?: string) => url && url.length > 5;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop Blur Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleDismiss}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
                />

                {/* Modal Card - High-End Luxury Editorial Design */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative w-full max-w-sm bg-[#0a0a0a]/95 border border-white/5 rounded-3xl p-8 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl flex flex-col items-center"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={16} />
                    </button>

                    {/* Rio2C Official Logo Image */}
                    <img 
                        src="/assets/rio2c-logo.png" 
                        alt="Rio2C Logo" 
                        className="h-8 w-auto object-contain select-none pointer-events-none mb-4 opacity-90"
                    />

                    {/* Welcoming Tag */}
                    <span className="text-[8px] tracking-[0.45em] uppercase text-foreground/40 font-medium mb-3 block">
                        Pitching Show 2026
                    </span>

                    {/* Title (Serif Cormorant Font) */}
                    <h2 className="text-3xl font-serif font-light text-foreground mb-3 tracking-wide leading-tight">
                        Boas-vindas
                    </h2>

                    {/* Subtitle (Serif Cormorant Font) */}
                    <p className="text-foreground/55 text-sm leading-relaxed mb-6 font-serif max-w-xs px-2">
                        Preparamos esta curadoria de materiais e canais de escuta rápida exclusivamente para curadores, diretores e parceiros da indústria.
                    </p>

                    {/* Minimalist Monochrome Grid */}
                    <div className="w-full flex flex-col gap-2.5 mb-6">
                        {hasLink(contact?.spotify) && (
                            <Link
                                href={contact.spotify!}
                                target="_blank"
                                className="flex items-center justify-between w-full px-5 py-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 text-foreground/80 hover:text-white rounded-xl transition-all duration-300 group hover:-translate-y-0.5"
                            >
                                <span className="flex items-center gap-3 font-medium text-xs tracking-wider uppercase">
                                    <Music2 size={16} className="text-white/40 group-hover:text-[#1DB954] transition-colors" />
                                    Ouvir no Spotify
                                </span>
                                <span className="text-[9px] opacity-40 uppercase tracking-widest font-sans">Single</span>
                            </Link>
                        )}

                        {hasLink(contact?.youtube) && (
                            <Link
                                href={contact.youtube!}
                                target="_blank"
                                className="flex items-center justify-between w-full px-5 py-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 text-foreground/80 hover:text-white rounded-xl transition-all duration-300 group hover:-translate-y-0.5"
                            >
                                <span className="flex items-center gap-3 font-medium text-xs tracking-wider uppercase">
                                    <Youtube size={16} className="text-white/40 group-hover:text-[#FF0000] transition-colors" />
                                    Clipe Oficial
                                </span>
                                <span className="text-[9px] opacity-40 uppercase tracking-widest font-sans">Vídeo</span>
                            </Link>
                        )}

                        {hasLink(contact?.instagram) && (
                            <Link
                                href={contact.instagram!}
                                target="_blank"
                                className="flex items-center justify-between w-full px-5 py-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 text-foreground/80 hover:text-white rounded-xl transition-all duration-300 group hover:-translate-y-0.5"
                            >
                                <span className="flex items-center gap-3 font-medium text-xs tracking-wider uppercase">
                                    <Instagram size={16} className="text-white/40 group-hover:text-[#E4405F] transition-colors" />
                                    Instagram
                                </span>
                                <span className="text-[9px] opacity-40 uppercase tracking-widest font-sans">Perfil</span>
                            </Link>
                        )}

                        {contact?.whatsapp && (
                            <Link
                                href={`https://wa.me/${contact.whatsapp}`}
                                target="_blank"
                                className="flex items-center justify-between w-full px-5 py-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 text-foreground/80 hover:text-white rounded-xl transition-all duration-300 group hover:-translate-y-0.5"
                            >
                                <span className="flex items-center gap-3 font-medium text-xs tracking-wider uppercase">
                                    <MessageCircle size={16} className="text-white/40 group-hover:text-[#25D366] transition-colors" />
                                    Contato Comercial
                                </span>
                                <span className="text-[9px] opacity-40 uppercase tracking-widest font-sans">WhatsApp</span>
                            </Link>
                        )}
                    </div>

                    {/* Dismiss Button - Bold Minimal Contrast */}
                    <button
                        onClick={handleDismiss}
                        className="w-full bg-white text-black hover:bg-white/90 font-serif tracking-[0.2em] py-3.5 rounded-xl transition-all duration-300 uppercase text-[10px] font-semibold shadow-[0_10px_20px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
                    >
                        Explorar Site
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
