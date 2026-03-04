import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcnqtzgnbysdrgokaysi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbnF0emduYnlzZHJnb2theXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTgzNzksImV4cCI6MjA4NzUzNDM3OX0.4aOQDd_4ItclJpNUOS7HEeEBn3et2Kg_sYTdPYdS5Po';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
    global: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
    },
});