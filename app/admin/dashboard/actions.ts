'use server'

import { getSiteContent, updateSiteContent } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import path from 'path';

export async function updateHero(prevState: any, formData: FormData) {
    try {
        const currentContent = await getSiteContent();
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        const newHero = {
            eyebrow: formData.get('eyebrow') as string,
            title: formData.get('title') as string,
            artist: formData.get('artist') as string,
            feat: formData.get('feat') as string,
            releaseDate: formData.get('releaseDate') as string,
            ctaText: formData.get('ctaText') as string,
            ctaLink: formData.get('ctaLink') as string,
        };

        await updateSiteContent({
            ...currentContent,
            hero: newHero,
        });

        revalidatePath('/');
        return { message: '✅ Topo salvo com sucesso!' };
    } catch (error) {
        return { message: '❌ Erro ao salvar.' };
    }
}

export async function updateStory(prevState: any, formData: FormData) {
    try {
        const currentContent = await getSiteContent();
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        const newStory = {
            title: formData.get('title') as string,
            body: formData.get('body') as string,
            signature: formData.get('signature') as string,
        };

        await updateSiteContent({
            ...currentContent,
            story: newStory,
        });

        revalidatePath('/');
        return { message: '✅ História salva com sucesso!' };
    } catch (error) {
        return { message: '❌ Erro ao salvar.' };
    }
}

export async function updateTheme(prevState: any, formData: FormData) {
    try {
        const currentContent = await getSiteContent();
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        let watermarkUrl = currentContent.theme?.watermark || '';
        const file = formData.get('watermarkFile') as File;

        if (file && file.size > 0) {
            // Upload to Supabase
            const ext = path.extname(file.name);
            const fileName = `watermark-${Date.now()}${ext}`;
            const buffer = await file.arrayBuffer();

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, buffer, { contentType: file.type });

            if (uploadError) throw uploadError;

            const { data: publicDesc } = supabase.storage.from('uploads').getPublicUrl(fileName);
            watermarkUrl = publicDesc.publicUrl;
        }

        await updateSiteContent({
            ...currentContent,
            theme: {
                ...currentContent.theme || {},
                watermark: watermarkUrl,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin/dashboard');

        return { message: '✅ Tema atualizado!' };
    } catch (error) {
        console.error(error);
        return { message: '❌ Erro ao salvar tema.' };
    }
}

export async function updateContact(prevState: any, formData: FormData) {
    try {
        const currentContent = await getSiteContent();
        const session = (await cookies()).get('admin_session');
        if (!session) return { message: '❌ Não autorizado.' };

        const newContact = {
            email: formData.get('email') as string,
            whatsapp: formData.get('whatsapp') as string,
            bookingText: formData.get('bookingText') as string,
            instagram: formData.get('instagram') as string,
            spotify: formData.get('spotify') as string,
            youtube: formData.get('youtube') as string,
            twitter: formData.get('twitter') as string,
            tiktok: formData.get('tiktok') as string,
        };

        await updateSiteContent({
            ...currentContent,
            contact: newContact,
        });

        revalidatePath('/');
        revalidatePath('/admin/dashboard');

        return { message: '✅ Contatos e Redes salvos!' };
    } catch (error) {
        return { message: '❌ Erro ao salvar.' };
    }
}
