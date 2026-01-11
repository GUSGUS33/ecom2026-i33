import { describe, it, expect } from 'vitest';
import { supabase } from './supabaseClient';

describe('Supabase Client', () => {
  it('should initialize with valid credentials', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should be able to connect to Supabase', async () => {
    // Test basic connectivity by getting the current session
    const { data, error } = await supabase.auth.getSession();
    
    // Should not throw an error (even if there's no session)
    expect(error).toBeNull();
    // Session can be null if not authenticated, that's fine
    expect(data).toBeDefined();
  });

  it('should have valid Supabase URL', () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    expect(url).toBeDefined();
    expect(url).toContain('supabase.co');
    expect(url).toContain('opwryjxwhfhjkficumsv');
  });

  it('should have valid Supabase ANON KEY', () => {
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    expect(key).toBeDefined();
    expect(key.length).toBeGreaterThan(0);
    // JWT tokens start with "eyJ"
    expect(key).toMatch(/^eyJ/);
  });

  it('should be able to access user_personalization table', async () => {
    // This test validates that we can query the database
    // It should not throw an error (even if the query returns no data)
    try {
      const { data, error } = await supabase
        .from('user_personalization')
        .select('id')
        .limit(1);
      
      // If there's an error, it should be about permissions (not connection)
      // Connection errors would be different
      expect(error === null || error.message.includes('permission')).toBe(true);
    } catch (err) {
      // Network errors would be caught here
      throw new Error(`Failed to connect to Supabase: ${err}`);
    }
  });
});
