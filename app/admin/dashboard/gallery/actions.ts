'use server'

import { getSiteContent, updateSiteContent } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import path from 'path';

export async function uploadPhoto(prevState: any, formData: FormData) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        const file = formData.get('file') as File;
        const caption = formData.get('caption') as string || '';

        if (!file || file.size === 0) {
            return { message: '❌ Nenhum arquivo enviado.' };
        }

        // Upload to Supabase Storage with Base64 fallback
        let publicUrl = '';
        const buffer = await file.arrayBuffer();
        try {
            const ext = path.extname(file.name);
            const fileName = `${randomUUID()}${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, buffer, { contentType: file.type });

            if (!uploadError) {
                const { data: publicDesc } = supabase.storage.from('uploads').getPublicUrl(fileName);
                publicUrl = publicDesc.publicUrl;
            } else {
                throw uploadError;
            }
        } catch (storageErr) {
            console.warn('Storage upload error, using base64 fallback:', storageErr);
            const base64 = Buffer.from(buffer).toString('base64');
            const mimeType = file.type || 'image/jpeg';
            publicUrl = `data:${mimeType};base64,${base64}`;
        }

        // Update DB
        const content = await getSiteContent();
        const newImage = {
            id: randomUUID(),
            type: 'image' as const,
            url: publicUrl,
            caption: caption,
        };

        await updateSiteContent({
            ...content,
            gallery: [newImage, ...content.gallery],
        });

        revalidatePath('/');
        revalidatePath('/admin/dashboard/gallery');

        return { message: '✅ Foto enviada com sucesso!' };
    } catch (error) {
        console.error(error);
        return { message: '❌ Erro ao enviar foto.' };
    }
}

export async function updatePhoto(id: string, caption: string) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        const content = await getSiteContent();

        const newGallery = content.gallery.map((img: any) => {
            if (img.id === id) {
                return { ...img, caption };
            }
            return img;
        });

        await updateSiteContent({
            ...content,
            gallery: newGallery,
        });

        revalidatePath('/');
        revalidatePath('/admin/dashboard/gallery');
        return { message: '✅ Legenda atualizada.' };
    } catch (error) {
        return { message: '❌ Erro ao atualizar.' };
    }
}

export async function deletePhoto(imageId: string) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        const content = await getSiteContent();
        const imageToDelete = content.gallery.find((img: any) => img.id === imageId);

        if (!imageToDelete) return { message: '❌ Imagem não encontrada.' };

        // Try to delete from Storage (Optional, good hygiene)
        // Extract filename from URL
        try {
            const urlParts = imageToDelete.url.split('/');
            const filename = urlParts[urlParts.length - 1];
            await supabase.storage.from('uploads').remove([filename]);
        } catch (e) { console.warn('Storage delete fail', e); }

        // Remove from DB
        await updateSiteContent({
            ...content,
            gallery: content.gallery.filter((img: any) => img.id !== imageId),
        });

        revalidatePath('/');
        revalidatePath('/admin/dashboard/gallery');
        return { message: '🗑️ Foto removida.' };
    } catch (error) {
        return { message: '❌ Erro ao excluir.' };
    }
}
