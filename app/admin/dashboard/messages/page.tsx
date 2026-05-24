import { getMessages } from '@/lib/db';
import { replyMessage, deleteMessage, approveMessage } from './actions';
import { Trash2, MessageSquare, Reply, Check, Clock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function MessagesDashboard() {
    const messages = await getMessages();

    // Split messages into Pending (Aguardando Aprovação) and Approved (Publicados)
    const pendingMessages = messages.filter((msg: any) => msg.approved !== true);
    const approvedMessages = messages.filter((msg: any) => msg.approved === true);

    return (
        <div className="space-y-12 max-w-4xl mx-auto pb-20 p-8">
            {/* Header */}
            <header className="mb-8 border-b border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-foreground">Moderação do Mural</h1>
                    <p className="text-foreground/60 text-sm">Aprove, responda ou remova mensagens enviadas pelos fãs.</p>
                </div>
                <Link href="/admin/dashboard" className="text-sm text-primary hover:underline font-medium">
                    ← Voltar para Conteúdo
                </Link>
            </header>

            {/* SEÇÃO 1: AGUARDANDO APROVAÇÃO (PENDENTES) */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Clock className="w-5 h-5 text-accent animate-pulse" />
                    <h2 className="text-xl font-serif text-foreground font-bold">
                        Aguardando Aprovação ({pendingMessages.length})
                    </h2>
                </div>

                <div className="space-y-4">
                    {pendingMessages.length === 0 ? (
                        <div className="text-center p-10 bg-white/[0.02] border border-white/5 rounded-lg">
                            <p className="text-sm text-foreground/40 font-serif">Nenhum recado pendente de aprovação. Tudo limpo! ✨</p>
                        </div>
                    ) : (
                        pendingMessages.map((msg: any) => (
                            <div key={msg.id} className="p-5 rounded border border-white/10 bg-yellow-500/[0.02] hover:bg-yellow-500/[0.04] transition-colors space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-accent text-base">{msg.name}</h3>
                                            <span className="text-[10px] text-foreground/30">{new Date(msg.created_at || msg.createdAt).toLocaleDateString()}</span>
                                            <span className="text-[9px] bg-yellow-500/10 text-yellow-500/80 px-2 py-0.5 rounded font-mono uppercase">Pendente</span>
                                        </div>
                                        <p className="text-foreground/80 font-serif italic mt-1 text-sm">"{msg.text}"</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* Approve Button */}
                                        <form action={approveMessage.bind(null, msg.id)}>
                                            <button 
                                                type="submit"
                                                className="text-green-400 hover:text-green-300 p-2 border border-green-500/20 rounded bg-green-500/5 hover:bg-green-500/10 transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                                                title="Aprovar e publicar"
                                            >
                                                <Check size={14} />
                                                Aprovar
                                            </button>
                                        </form>

                                        {/* Reject / Delete Button */}
                                        <form action={deleteMessage.bind(null, msg.id)}>
                                            <button 
                                                type="submit"
                                                className="text-red-400 hover:text-red-300 p-2 border border-red-500/20 rounded bg-red-500/5 hover:bg-red-500/10 transition-colors"
                                                title="Rejeitar / Excluir Spam"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* SEÇÃO 2: PUBLICADOS NO SITE (APROVADOS) */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-serif text-foreground font-bold">
                        Publicados no Site ({approvedMessages.length})
                    </h2>
                </div>

                <div className="space-y-4">
                    {approvedMessages.length === 0 ? (
                        <p className="text-center text-foreground/40 py-12 text-sm font-serif">Nenhuma mensagem publicada ainda.</p>
                    ) : (
                        approvedMessages.map((msg: any) => (
                            <div key={msg.id} className="p-6 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] space-y-4 transition-all">
                                
                                {/* Message Content */}
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-primary text-base">{msg.name}</h3>
                                            <span className="text-[10px] text-foreground/30">{new Date(msg.created_at || msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-foreground/80 font-serif italic mt-1 text-sm">"{msg.text}"</p>
                                    </div>

                                    {/* Delete Button */}
                                    <form action={deleteMessage.bind(null, msg.id)}>
                                        <button 
                                            type="submit"
                                            className="text-red-500/60 hover:text-red-400 p-2 border border-red-500/10 hover:border-red-500/30 rounded hover:bg-red-500/5 transition-colors" 
                                            title="Excluir do Site"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </form>
                                </div>

                                {/* Reply Block */}
                                <div className="pt-4 border-t border-white/5">
                                    {msg.reply ? (
                                        <div className="flex gap-3 items-start bg-primary/5 p-4 rounded ml-4 border-l-2 border-primary">
                                            <Reply className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Thami respondeu:</p>
                                                <p className="text-sm text-foreground/90">{msg.reply}</p>
                                            </div>
                                            <form action={async () => {
                                                'use server'
                                                await replyMessage(msg.id, ''); // Clean reply
                                            }}>
                                                <button type="submit" className="text-[10px] text-white/30 hover:text-red-400 underline transition-colors">Apagar resposta</button>
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
                                                    placeholder="Escreva uma resposta pública..."
                                                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-white/20"
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                className="bg-white/5 hover:bg-primary hover:text-white text-foreground/75 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all border border-white/10 hover:border-primary/50"
                                            >
                                                Responder
                                            </button>
                                        </form>
                                    )}
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
