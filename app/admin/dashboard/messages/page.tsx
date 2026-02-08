import { getMessages } from '@/lib/db';
import { replyMessage, deleteMessage } from './actions';
import { Trash2, MessageSquare, Reply } from 'lucide-react';
import Link from 'next/link';

export default async function MessagesDashboard() {
    const messages = await getMessages();

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20 p-8">
            <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-foreground">Mural de Recados</h1>
                    <p className="text-foreground/60">Gerencie e responda as mensagens dos fãs.</p>
                </div>
                <Link href="/admin/dashboard" className="text-sm text-primary hover:underline">
                    ← Voltar para Conteúdo
                </Link>
            </header>

            <div className="space-y-6">
                {messages.length === 0 ? (
                    <p className="text-center text-foreground/40 py-12">Nenhum recado ainda.</p>
                ) : (
                    messages.map((msg: any) => (
                        <div key={msg.id} className="p-6 rounded border border-white/10 bg-white/5 space-y-4">

                            {/* Message Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-foreground text-lg">{msg.name}</h3>
                                        <span className="text-xs text-foreground/40">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-foreground/80 font-serif italic mt-1">"{msg.text}"</p>
                                </div>

                                <form action={deleteMessage.bind(null, msg.id)}>
                                    <button className="text-red-500 hover:text-red-400 p-2 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors" title="Excluir">
                                        <Trash2 size={16} />
                                    </button>
                                </form>
                            </div>

                            {/* Reply Section */}
                            <div className="pt-4 border-t border-white/5">
                                {msg.reply ? (
                                    <div className="flex gap-4 items-start bg-primary/10 p-4 rounded ml-4 border-l-2 border-primary">
                                        <Reply className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-primary mb-1">Você respondeu:</p>
                                            <p className="text-sm text-foreground/90">{msg.reply}</p>
                                        </div>
                                        <form action={async (formData) => {
                                            'use server'
                                            await replyMessage(msg.id, ''); // Clear reply
                                        }}>
                                            <button className="text-xs text-white/30 hover:text-red-400 underline">Apagar</button>
                                        </form>
                                    </div>
                                ) : (
                                    <form action={async (formData) => {
                                        'use server'
                                        const text = formData.get('replyText') as string;
                                        await replyMessage(msg.id, text);
                                    }} className="flex gap-2 ml-4">
                                        <div className="flex-1">
                                            <input
                                                name="replyText"
                                                placeholder="Escreva uma resposta..."
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <button type="submit" className="bg-white/10 hover:bg-primary hover:text-white text-foreground/70 px-4 py-2 rounded text-sm transition-colors border border-white/10">
                                            Responder
                                        </button>
                                    </form>
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
