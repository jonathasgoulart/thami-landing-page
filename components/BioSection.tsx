'use client'

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BioCard {
    id: string;
    label: string;
    title: string;
    text: string;
    imageUrl?: string;
}

export function BioSection({ cards }: { cards: BioCard[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -520, behavior: 'smooth' });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 520, behavior: 'smooth' });

    if (!cards || cards.length === 0) return null;

    return (
        <section className="py-12 md:py-24 overflow-hidden relative group">
            {/* Section Header */}
            <div className="container mx-auto px-4 mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif text-foreground tracking-wide mt-1">
                        Sobre THAMI
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={scrollLeft}
                        className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors hidden md:flex"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors hidden md:flex"
                        aria-label="Próximo"
                    >
                        <ChevronRight size={20} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Scrollable Cards */}
            <div className="pl-4 md:pl-[max(1rem,calc((100vw-1280px)/2))]">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="snap-start flex-shrink-0 w-[90vw] sm:w-[640px] md:w-[700px] rounded-2xl overflow-hidden border border-white/8 bg-white/[0.03] flex flex-col md:flex-row min-h-[420px]"
                        >
                            {/* Image Side */}
                            <div className="relative w-full md:w-[300px] h-[260px] md:h-auto flex-shrink-0 bg-black/30">
                                {card.imageUrl ? (
                                    <img
                                        src={card.imageUrl}
                                        alt={card.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                        <span className="font-serif text-6xl text-white">"</span>
                                    </div>
                                )}
                                {/* Gradient overlay blending into text side */}
                                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent to-black/60 pointer-events-none" />
                            </div>

                            {/* Text Side */}
                            <div className="flex-1 p-7 md:p-10 flex flex-col justify-between relative">
                                {/* Decorative quote mark */}
                                <span className="absolute top-4 right-6 font-serif text-6xl text-primary/10 leading-none select-none pointer-events-none">"</span>

                                <div className="space-y-3">
                                    <span className="inline-block text-[10px] font-medium tracking-[0.25em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {card.label}
                                    </span>
                                    <h3 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-foreground/70 text-sm md:text-base leading-relaxed font-serif line-clamp-[10]">
                                        {card.text}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Spacer */}
                    <div className="flex-shrink-0 w-4 md:w-8" />
                </div>
            </div>
        </section>
    );
}
