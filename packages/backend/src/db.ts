import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

export async function connectDB() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not found, skipping database connection');
      return;
    }

    const supabase = getSupabase();
    // Test connection with a simple query
    const { error } = await supabase.from('users').select('count()', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Connected to Supabase');
  } catch (error) {
    console.error('Supabase connection error:', error);
    // Don't throw, allow server to start without database
    console.warn('Server starting without database connection');
  }
}

export function disconnectDB() {
  // Supabase client doesn't need explicit disconnection
  return Promise.resolve();
}
