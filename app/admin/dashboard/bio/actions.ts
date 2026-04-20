'use server'

import { getSiteContent, updateSiteContent } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import path from 'path';

export async function updateBioCard(prevState: any, formData: FormData) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        const id = formData.get('id') as string;
        const label = formData.get('label') as string;
        const title = formData.get('title') as string;
        const text = formData.get('text') as string;
        const file = formData.get('imageFile') as File;

        const content = await getSiteContent();
        const bioCards: any[] = content.bioCards || [];

        const cardIndex = bioCards.findIndex((c: any) => c.id === id);
        if (cardIndex === -1) return { message: '❌ Card não encontrado.' };

        let imageUrl = bioCards[cardIndex].imageUrl || '';

        // Upload new image if provided
        if (file && file.size > 0) {
            const ext = path.extname(file.name);
            const fileName = `bio-${randomUUID()}${ext}`;
            const buffer = await file.arrayBuffer();

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, buffer, { contentType: file.type });

            if (uploadError) throw uploadError;

            const { data: publicDesc } = supabase.storage.from('uploads').getPublicUrl(fileName);
            imageUrl = publicDesc.publicUrl;
        }

        bioCards[cardIndex] = {
            ...bioCards[cardIndex],
            label,
            title,
            text,
            imageUrl,
        };

        await updateSiteContent({ ...content, bioCards });

        revalidatePath('/');
        revalidatePath('/admin/dashboard/bio');
        return { message: '✅ Card atualizado!' };
    } catch (error) {
        console.error(error);
        return { message: '❌ Erro ao salvar card.' };
    }
}
