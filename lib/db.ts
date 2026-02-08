import { supabase } from './supabase';

// --- Site Content ---
export async function getSiteContent() {
    const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 1)
        .single();

    if (error || !data) {
        console.error('Error fetching content:', error);
        // Return default structure if db empty
        return {
            hero: {},
            story: {},
            gallery: [],
            theme: {},
            contact: {}
        };
    }
    return data.data;
}

export async function updateSiteContent(newContent: any) {
    const { error } = await supabase
        .from('site_content')
        .upsert({ id: 1, data: newContent });

    if (error) console.error('Error updating content:', error);
}

// --- Fan Messages ---
export async function getMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

export async function saveMessage(message: any) {
    const { error } = await supabase
        .from('messages')
        .insert(message);

    if (error) throw error;
}

export async function updateMessageStatus(id: string, approved: boolean) {
    const { error } = await supabase
        .from('messages')
        .update({ approved })
        .eq('id', id);
}

export async function replyMessageDb(id: string, reply: string) {
    const { error } = await supabase
        .from('messages')
        .update({ reply })
        .eq('id', id);
}

export async function deleteMessage(id: string) {
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
}
