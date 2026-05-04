import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('ANON KEY (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test 1: Get session
console.log('📝 Test 1: Get Session');
const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
console.log('Session data:', sessionData);
console.log('Session error:', sessionError);
console.log('');

// Test 2: Query user_personalization table
console.log('📝 Test 2: Query user_personalization table');
const { data, error } = await supabase
  .from('user_personalization')
  .select('id')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
console.log('Error message:', error?.message);
console.log('Error code:', error?.code);
console.log('Error details:', error?.details);
console.log('Error hint:', error?.hint);
console.log('');

// Test 3: Check if table exists by querying information_schema
console.log('📝 Test 3: List all tables');
const { data: tables, error: tablesError } = await supabase
  .from('information_schema.tables')
  .select('table_name')
  .eq('table_schema', 'public');

console.log('Tables:', tables);
console.log('Tables error:', tablesError);
