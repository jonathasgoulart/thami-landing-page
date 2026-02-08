'use client'

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Gallery({ images }: { images: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (scrollRef.current) {
            setWidth(scrollRef.current.scrollWidth - scrollRef.current.offsetWidth);
        }
    }, [images]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <section className="py-12 md:py-24 bg-black/10 overflow-hidden relative group">
            <div className="container mx-auto px-4 mb-4 flex justify-between items-end">
                <h2 className="text-2xl md:text-3xl font-serif text-primary tracking-wide">
                    Galeria
                </h2>
                <div className="flex gap-2">
                    <button onClick={scrollLeft} className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors hidden md:flex">
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                    <button onClick={scrollRight} className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors hidden md:flex">
                        <ChevronRight size={20} className="text-white" />
                    </button>
                </div>
            </div>

            <div className="pl-4 md:pl-[max(1rem,calc((100vw-1280px)/2))]">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 md:gap-8 pb-8 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {images.map((img, index) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            key={img.id}
                            className="snap-start relative h-[400px] w-[300px] md:h-[500px] md:w-[400px] flex-shrink-0 rounded-lg overflow-hidden bg-white/5"
                        >
                            <img
                                src={img.url}
                                alt={img.caption || 'Thami'}
                                className="w-full h-full object-cover pointer-events-none"
                                loading="lazy"
                            />
                            {img.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-sm font-serif">{img.caption}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
