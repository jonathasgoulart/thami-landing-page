import { getSiteContent } from '@/lib/db';
import { GalleryManager } from '@/components/admin/GalleryManager';

export default async function GalleryPage() {
    const content = await getSiteContent();

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-serif text-foreground">Gerenciar Galeria</h1>
                <p className="text-foreground/60">Adicione ou remova fotos do mural.</p>
            </header>

            <GalleryManager gallery={content.gallery} />
        </div>
    );
}
