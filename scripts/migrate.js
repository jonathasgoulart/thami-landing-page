const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Keys not found via dotenv. Hardcoding for script usage (temporary).');
    // Note: Usually we rely on dotenv. If it fails, I'll ask user to run with env vars.
    // For now, let's assume dotenv works or I will paste them here in NEXT step if needed.
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('🚀 Starting Migration...');

    // 1. Load Local Data
    const contentPath = path.join(__dirname, '../data/content.json');
    const messagesPath = path.join(__dirname, '../data/messages.json');

    let content = {};
    let messages = [];

    try {
        content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
        console.log('✅ Loaded content.json');
    } catch (e) { console.warn('⚠️ No content.json found'); }

    try {
        messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
        console.log(`✅ Loaded messages.json (${messages.length} msgs)`);
    } catch (e) { console.warn('⚠️ No messages.json found'); }

    // 2. Upload Images (Gallery + Watermark)
    // Helper to upload file
    async function uploadFile(localUrl) {
        if (!localUrl || !localUrl.startsWith('/uploads/')) return localUrl;

        const filename = path.basename(localUrl);
        const filePath = path.join(__dirname, '../public', localUrl);

        try {
            const fileBuffer = fs.readFileSync(filePath);
            const { data, error } = await supabase.storage
                .from('uploads')
                .upload(filename, fileBuffer, { upsert: true, contentType: 'image/jpeg' }); // Assume jpg for simplicity or detect

            if (error) throw error;

            const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(filename);
            console.log(`☁️ Uploaded: ${filename} -> ${publicData.publicUrl}`);
            return publicData.publicUrl; // New remote URL
        } catch (e) {
            console.error(`❌ Failed to upload ${localUrl}:`, e.message);
            return localUrl; // Keep local if fail (won't work online but prevents crash)
        }
    }

    // Process Theme (Watermark)
    if (content.theme && content.theme.watermark) {
        content.theme.watermark = await uploadFile(content.theme.watermark);
    }

    // Process Gallery
    if (content.gallery && Array.isArray(content.gallery)) {
        for (let img of content.gallery) {
            img.url = await uploadFile(img.url);
        }
    }

    // 3. Save Content to DB
    const { error: contentError } = await supabase
        .from('site_content')
        .upsert({ id: 1, data: content });

    if (contentError) console.error('❌ Error saving content:', contentError);
    else console.log('✅ Site Content migrated to DB!');

    // 4. Save Messages to DB
    if (messages.length > 0) {
        // Map fields to match DB schema if needed
        const dbMessages = messages.map(m => ({
            id: m.id,
            name: m.name,
            text: m.text,
            reply: m.reply || null,
            approved: m.approved !== false, // Default true
            created_at: m.createdAt || new Date().toISOString()
        }));

        const { error: msgError } = await supabase
            .from('messages')
            .upsert(dbMessages);

        if (msgError) console.error('❌ Error saving messages:', msgError);
        else console.log('✅ Messages migrated to DB!');
    }

    console.log('✨ Migration Complete!');
}

migrate();
