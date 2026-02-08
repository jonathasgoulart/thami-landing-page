import { createClient } from '@supabase/supabase-js';

// Use empty string fallback to prevent crash during module load if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase Keys are missing! Database calls will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
