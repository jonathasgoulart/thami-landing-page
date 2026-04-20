'use client'

import { useState, useActionState } from 'react';
import imageCompression from 'browser-image-compression';
import { updateBioCard } from '@/app/admin/dashboard/bio/actions';
import { Pencil, Upload, Loader2, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface BioCard {
    id: string;
    label: string;
    title: string;
    text: string;
    imageUrl?: string;
}

function BioCardEditor({ card }: { card: BioCard }) {
    const [isOpen, setIsOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(card.imageUrl || null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [labelValue, setLabelValue] = useState(card.label);
    const [titleValue, setTitleValue] = useState(card.title);
    const [textValue, setTextValue] = useState(card.text);

    const [state, formAction, isPending] = useActionState(updateBioCard, { message: '' });

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsCompressing(true);
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 1.5,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            });
            setCompressedFile(compressed);
            setPreview(URL.createObjectURL(compressed));
        } catch (err) {
            console.error(err);
        } finally {
            setIsCompressing(false);
        }
    }

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden">
            {/* Card Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
            >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">sem foto</div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-primary uppercase tracking-widest font-medium">{card.label}</span>
                    <p className="text-sm font-serif text-foreground truncate">{card.title}</p>
                </div>

                {!card.imageUrl && (
                    <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded mr-2">Sem imagem</span>
                )}

                {isOpen ? <ChevronUp size={16} className="text-white/40 flex-shrink-0" /> : <ChevronDown size={16} className="text-white/40 flex-shrink-0" />}
            </button>

            {/* Card Editor */}
            {isOpen && (
                <div className="border-t border-white/10 p-6 bg-black/20">
                    <form action={async (formData: FormData) => {
                        if (compressedFile) {
                            formData.set('imageFile', compressedFile);
                        }
                        await formAction(formData);
                    }} className="space-y-6">
                        <input type="hidden" name="id" value={card.id} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="text-xs text-foreground/50 uppercase tracking-wider">Foto do Card</label>
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 border-dashed hover:border-primary/50 transition-colors">
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                            <label
                                                htmlFor={`file-${card.id}`}
                                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                <span className="text-white text-xs flex items-center gap-2">
                                                    <Upload size={14} /> Trocar foto
                                                </span>
                                            </label>
                                        </>
                                    ) : (
                                        <label htmlFor={`file-${card.id}`} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer gap-2">
                                            {isCompressing ? (
                                                <Loader2 size={24} className="text-primary animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload size={24} className="text-accent" />
                                                    <span className="text-xs text-foreground/50">Clique para enviar</span>
                                                </>
                                            )}
                                        </label>
                                    )}
                                    <input
                                        id={`file-${card.id}`}
                                        name="imageFileInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="text-[10px] text-foreground/30">Recomendado: foto na horizontal (landscape). Compressão automática.</p>
                            </div>

                            {/* Text Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-foreground/50 uppercase tracking-wider block mb-1">Label (badge)</label>
                                    <input
                                        name="label"
                                        value={labelValue}
                                        onChange={e => setLabelValue(e.target.value)}
                                        placeholder="Ex: QUEM SOU"
                                        className="w-full bg-transparent border-b border-white/20 py-2 text-foreground text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-foreground/50 uppercase tracking-wider block mb-1">Título</label>
                                    <input
                                        name="title"
                                        value={titleValue}
                                        onChange={e => setTitleValue(e.target.value)}
                                        placeholder="Ex: Sobre THAMI"
                                        className="w-full bg-transparent border-b border-white/20 py-2 text-foreground text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text area */}
                        <div>
                            <label className="text-xs text-foreground/50 uppercase tracking-wider block mb-2">Texto</label>
                            <textarea
                                name="text"
                                value={textValue}
                                onChange={e => setTextValue(e.target.value)}
                                rows={8}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-y placeholder:text-white/20 font-serif leading-relaxed min-h-[160px]"
                                placeholder="Escreva o conteúdo do card..."
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            {state.message && (
                                <p className={`text-xs ${state.message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                                    {state.message}
                                </p>
                            )}
                            <div className="ml-auto">
                                <button
                                    type="submit"
                                    disabled={isPending || isCompressing}
                                    className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/80 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export function BioManager({ bioCards }: { bioCards: BioCard[] }) {
    if (!bioCards || bioCards.length === 0) {
        return (
            <div className="text-center py-16 text-foreground/40 border border-dashed border-white/10 rounded-xl">
                <p>Nenhum card configurado.</p>
                <p className="text-xs mt-2">Inicialize o conteúdo pela base de dados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-xs text-foreground/40 pb-2">
                {bioCards.length} cards • Clique em um card para editar
            </p>
            {bioCards.map((card) => (
                <BioCardEditor key={card.id} card={card} />
            ))}
        </div>
    );
}
