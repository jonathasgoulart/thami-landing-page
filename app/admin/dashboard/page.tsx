import { getSiteContent } from '@/lib/db';
import { HeroForm } from '@/components/admin/HeroForm';
import { StoryForm } from '@/components/admin/StoryForm';
import { ThemeForm } from '@/components/admin/ThemeForm';
import { ContactForm } from '@/components/admin/ContactForm';
import { MessageSquare, Image, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function Dashboard() {
    const content = await getSiteContent();

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <header className="mb-8 border-b border-white/10 pb-6">
                <h1 className="text-3xl font-serif text-foreground">Gerenciar Conteúdo</h1>
                <p className="text-foreground/60">Edite os textos e links do site.</p>

                {/* Navigation Quick Links */}
                <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                        href="/admin/dashboard/gallery"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-sm font-medium"
                    >
                        <Image size={16} className="text-primary" />
                        Gerenciar Galeria
                        <ArrowRight size={14} className="opacity-50" />
                    </Link>

                    <Link
                        href="/admin/dashboard/messages"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-sm font-medium"
                    >
                        <MessageSquare size={16} className="text-accent" />
                        Mural de Recados
                        <ArrowRight size={14} className="opacity-50" />
                    </Link>
                </div>
            </header>

            {/* Theme Settings (Watermark) */}
            <section id="theme">
                <ThemeForm data={content.theme || {}} />
            </section>

            {/* Hero Section Form */}
            <section id="hero">
                <HeroForm data={content.hero} />
            </section>

            {/* Story Section Form */}
            <section id="story">
                <StoryForm data={content.story} />
            </section>

            {/* Contact Section Form */}
            <section id="contact">
                <ContactForm data={content.contact || {}} />
            </section>

            {/* Footer Message */}
            <div className="p-4 bg-white/5 border border-dashed border-white/20 rounded text-center opacity-50 text-sm">
                <p className="text-xs">As alterações são salvas em <code>data/content.json</code></p>
            </div>
        </div>
    );
}
