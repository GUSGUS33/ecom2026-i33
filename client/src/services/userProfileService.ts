import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  id: number;
  created_at: string;
  supabase_user_id: string;
  woo_customer_id: number | null;
  email: string;
  is_newsletter_subscribed: boolean;
  newsletter_consent_at: string | null;
  newsletter_source: string | null;
}

/**
 * Obtiene o crea el perfil del usuario en user_personalization
 * Si no existe, lo crea automáticamente
 */
export async function getOrCreateUserProfile(
  supabaseUserId: string,
  email: string
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    // Intentar obtener el perfil existente
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_personalization')
      .select('*')
      .eq('supabase_user_id', supabaseUserId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (es esperado si no existe)
      throw fetchError;
    }

    // Si ya existe, devolverlo
    if (existingProfile) {
      return { profile: existingProfile as UserProfile, error: null };
    }

    // Si no existe, crear uno nuevo
    const { data: newProfile, error: insertError } = await supabase
      .from('user_personalization')
      .insert({
        supabase_user_id: supabaseUserId,
        email: email,
        woo_customer_id: null,
        is_newsletter_subscribed: false,
        newsletter_consent_at: null,
        newsletter_source: null,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return { profile: newProfile as UserProfile, error: null };
  } catch (error) {
    console.error('Error in getOrCreateUserProfile:', error);
    return { profile: null, error: error as Error };
  }
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateUserProfile(
  supabaseUserId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'supabase_user_id'>>
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('user_personalization')
      .update(updates)
      .eq('supabase_user_id', supabaseUserId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { profile: data as UserProfile, error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { profile: null, error: error as Error };
  }
}
