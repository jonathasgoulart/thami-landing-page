'use server'

import { saveMessage, updateMessageStatus, deleteMessage as deleteMsgDb, getMessages, updateSiteContent } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'data/messages.json');

export async function submitMessage(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const text = formData.get('text') as string;

        if (!name || !text) return { message: '❌ Preencha todos os campos.' };

        const newMessage = {
            id: randomUUID(),
            name,
            text,
            approved: true, // AUTO-APPROVED by default now
            reply: null,    // Init reply as null
            createdAt: new Date().toISOString(),
        };

        await saveMessage(newMessage);

        revalidatePath('/');
        return { message: '✅ Recado enviado!' }; // Removed "Aguardando aprovação"
    } catch (error) {
        return { message: '❌ Erro ao enviar.' };
    }
}

export async function replyMessage(id: string, replyText: string) {
    const session = (await cookies()).get('admin_session');
    if (!session) return { message: '❌ Não autorizado.' };

    const messages = await getMessages();
    const updated = messages.map((msg: any) =>
        msg.id === id ? { ...msg, reply: replyText } : msg
    );

    // Low-level write (should actally be in lib/db but ok here for speed)
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(updated, null, 2));

    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/');
    return { message: '✅ Resposta enviada.' };
}

// Keep existing approveMessage (just in case they want to hide/show later)
export async function approveMessage(id: string) {
    const session = (await cookies()).get('admin_session');
    if (!session) return { message: '❌ Não autorizado.' };

    await updateMessageStatus(id, true);
    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/');
}

export async function deleteMessage(id: string) {
    const session = (await cookies()).get('admin_session');
    if (!session) return { message: '❌ Não autorizado.' };

    await deleteMsgDb(id);
    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/');
}
