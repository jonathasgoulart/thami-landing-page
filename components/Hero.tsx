import Link from "next/link";
import { MoveRight } from "lucide-react";

interface HeroProps {
    content: {
        eyebrow: string;
        title: string;
        artist: string;
        feat: string;
        releaseDate: string;
        ctaText: string;
        ctaLink: string;
    }
}

export default function Hero({ content }: HeroProps) {
    if (!content) return null;

    return (
        <section className="relative h-[100dvh] min-h-[600px] flex flex-col items-center justify-between overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-black to-primary/20 opacity-40 select-none pointer-events-none" />

            {/* Main Content (Pushed up slightly) */}
            <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center justify-center flex-grow gap-3 md:gap-6 mt-4 md:mt-10">

                <span className="text-accent tracking-[0.2em] text-[10px] md:text-sm font-medium uppercase animate-fade-in opacity-80">
                    {content.eyebrow}
                </span>

                <h1 className="font-serif text-[42px] xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground leading-[0.9] tracking-tight">
                    {content.title}
                </h1>

                <h2 className="text-primary text-base xs:text-lg md:text-2xl font-light tracking-widest uppercase mt-2 md:mt-0">
                    {content.artist} <span className="text-accent mx-2">•</span> {content.feat}
                </h2>

                <p className="text-foreground/60 text-xs md:text-sm tracking-wider mt-1 md:mt-2">
                    {content.releaseDate}
                </p>

                <Link
                    href={content.ctaLink || '#'}
                    target="_blank"
                    className="mt-4 md:mt-6 group relative inline-flex items-center gap-2 md:gap-3 px-6 py-2 md:px-8 md:py-3 bg-primary text-white font-serif text-sm md:text-lg tracking-wider hover:bg-primary/90 transition-all duration-300 rounded-sm overflow-hidden shadow-lg shadow-primary/20"
                >
                    <span className="relative z-10 whitespace-nowrap">{content.ctaText}</span>
                    <MoveRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
            </div>

            {/* Spotify Player - Fixed Bottom (Small Padding on Mobile) */}
            <div className="relative z-20 w-full max-w-2xl px-4 pb-4 md:pb-12 animate-fade-in-up flex-shrink-0">
                <div className="glass-panel p-[2px] rounded-xl shadow-2xl border border-white/10 bg-black/60 backdrop-blur-md transform scale-95 md:scale-100 origin-bottom">
                    <iframe
                        style={{ borderRadius: '10px' }}
                        src="https://open.spotify.com/embed/album/6lwP5k0KjFzM2Rk1sIdCfN?utm_source=generator&theme=0"
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}
