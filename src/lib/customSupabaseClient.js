import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcnqtzgnbysdrgokaysi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbnF0emduYnlzZHJnb2theXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTgzNzksImV4cCI6MjA4NzUzNDM3OX0.4aOQDd_4ItclJpNUOS7HEeEBn3et2Kg_sYTdPYdS5Po';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
