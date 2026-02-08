'use client'

import { useState } from 'react';
import { useActionState } from 'react';
import { updateTheme } from '@/app/admin/dashboard/actions';
import imageCompression from 'browser-image-compression';
import { Loader2, Upload } from 'lucide-react';

export function ThemeForm({ data }: { data: any }) {
    const [state, formAction] = useActionState(updateTheme, { message: '' });
    const [isCompressing, setIsCompressing] = useState(false);

    async function handleSubmit(formData: FormData) {
        const file = formData.get('watermarkFile') as File;

        if (file && file.size > 0) {
            setIsCompressing(true);
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    kS: 0, // initial
                };
                const compressedFile = await imageCompression(file, options);

                // Replace the file in FormData
                formData.set('watermarkFile', compressedFile, file.name);
            } catch (e) {
                console.error(e);
            }
            setIsCompressing(false);
        }

        // @ts-ignore
        formAction(formData);
    }

    return (
        <div className="bg-card border border-white/5 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-primary">Configurações Visuais</h2>
                {state?.message && (
                    <span className="text-sm px-3 py-1 rounded bg-green-900/30 text-green-400 border border-green-900/50 animate-pulse">
                        {state.message}
                    </span>
                )}
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-accent opacity-70">Marca D'água (Fundo do Site)</label>
                    <div className="flex items-center gap-4">
                        {data?.watermark && (
                            <img src={data.watermark} alt="Atual" className="w-16 h-16 object-cover rounded border border-white/10" />
                        )}

                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded flex items-center gap-2 text-sm transition-colors">
                            {isCompressing ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                            <span>Escolher Nova Imagem</span>
                            <input type="file" name="watermarkFile" accept="image/*" className="hidden" />
                        </label>
                    </div>
                    <p className="text-xs text-foreground/40">A imagem será comprimida automaticamente e aplicada com opacidade reduzida.</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button type="submit" disabled={isCompressing} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-50">
                        {isCompressing ? 'Processando...' : 'Salvar Tema'}
                    </button>
                </div>
            </form>
        </div>
    );
}
