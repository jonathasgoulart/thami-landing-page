'use server'

import { saveMessage, updateMessageStatus, deleteMessage as deleteMsgDb, getMessages, replyMessageDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

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

    await replyMessageDb(id, replyText);

    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/');
    return { message: '✅ Resposta enviada.' };
}

// Fixed signature for form action compatibility (FormData as second arg)
export async function approveMessage(id: string, formData?: FormData) {
    const session = (await cookies()).get('admin_session');
    if (!session) return; // Return void/undefined to satisfy signature

    await updateMessageStatus(id, true);
    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/');
}

// Fixed signature for form action compatibility
export async function deleteMessage(id: string, formData?: FormData) {
    const session = (await cookies()).get('admin_session');
    if (!session) return;

    await deleteMsgDb(id);
    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/');
}
