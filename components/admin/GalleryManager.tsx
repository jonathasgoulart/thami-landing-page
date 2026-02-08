'use client'

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadPhoto, deletePhoto, updatePhoto } from '@/app/admin/dashboard/gallery/actions';
import { Trash2, Upload, Loader2, Save, Pencil } from 'lucide-react';

export function GalleryManager({ gallery }: { gallery: any[] }) {
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editCaption, setEditCaption] = useState('');

    async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setMessage('Comprimindo imagem...');

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);

            setMessage('Enviando...');
            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('caption', file.name.split('.')[0]);

            const result = await uploadPhoto(null, formData);
            setMessage(result.message);
        } catch (error) {
            console.error(error);
            setMessage('❌ Erro na compressão/envio.');
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    }

    async function handleUpdateCaption(id: string) {
        await updatePhoto(id, editCaption);
        setEditingId(null);
    }

    return (
        <div className="space-y-8">
            {/* Upload Area */}
            <div className="bg-card border border-white/10 rounded-lg p-8 text-center border-dashed border-2 hover:border-primary/50 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    id="photo-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-4">
                    {isUploading ? (
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    ) : (
                        <Upload className="w-12 h-12 text-accent" />
                    )}
                    <span className="text-lg font-medium text-foreground">
                        {isUploading ? message : 'Clique para adicionar uma foto'}
                    </span>
                    <span className="text-sm text-foreground/50">
                        (Suporta arquivos grandes • Compressão automática)
                    </span>
                </label>
            </div>

            {/* Message */}
            {message && !isUploading && (
                <div className="p-3 bg-white/5 rounded text-center text-sm">{message}</div>
            )}

            {/* Grid */}
            <h3 className="text-xl font-serif text-primary">Mural Atual ({gallery.length} fotos)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((item) => (
                    <div key={item.id} className="group relative bg-black/20 rounded-lg overflow-hidden border border-white/5 flex flex-col">
                        <div className="aspect-square relative">
                            <img
                                src={item.url}
                                alt={item.caption}
                                className="w-full h-full object-cover"
                            />

                            <button
                                onClick={() => {
                                    if (confirm('Tem certeza?')) deletePhoto(item.id);
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="p-3 border-t border-white/5 bg-black/40">
                            {editingId === item.id ? (
                                <div className="flex gap-2">
                                    <input
                                        value={editCaption}
                                        onChange={(e) => setEditCaption(e.target.value)}
                                        className="bg-white/10 text-white text-xs px-2 py-1 rounded w-full border border-white/20 focus:outline-none focus:border-primary"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleUpdateCaption(item.id)}
                                        className="text-green-400 hover:text-green-300"
                                    >
                                        <Save size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center group/edit">
                                    <span className="text-xs text-foreground/80 truncate">{item.caption}</span>
                                    <button
                                        onClick={() => {
                                            setEditingId(item.id);
                                            setEditCaption(item.caption);
                                        }}
                                        className="text-white/40 hover:text-white opacity-0 group-hover/edit:opacity-100 transition-opacity"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
