import { getSiteContent } from '@/lib/db';
import { BioManager } from '@/components/admin/BioManager';

export default async function BioPage() {
    const content = await getSiteContent();
    const bioCards = content.bioCards || [];

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <header className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-serif text-foreground">Seção "Sobre THAMI"</h1>
                <p className="text-foreground/60 mt-1">Edite os cards de apresentação exibidos no site após a galeria.</p>
            </header>

            <BioManager bioCards={bioCards} />
        </div>
    );
}
