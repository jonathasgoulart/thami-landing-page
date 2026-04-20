import { getSiteContent } from '@/lib/db';
import { ThemeForm } from '@/components/admin/ThemeForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SettingsPage() {
    const content = await getSiteContent();

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-20">
            <header className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-serif text-foreground">Configurações</h1>
                <p className="text-foreground/60 mt-1">Aparência e configurações visuais do site.</p>
            </header>

            <section>
                <ThemeForm data={content.theme || {}} />
            </section>
        </div>
    );
}
