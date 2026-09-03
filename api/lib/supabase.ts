import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function connectDB() {
  // Test connection
  const { data, error } = await supabase.from('users').select('count(*)').limit(1);
  if (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
  return true;
}
