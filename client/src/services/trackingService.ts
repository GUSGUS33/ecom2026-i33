import { supabase } from '@/lib/supabaseClient';

export interface TrackProductViewInput {
  productId: number;
  productSlug: string;
}

/**
 * Registra una vista de producto en public.viewed_products
 * Solo funciona si el usuario está autenticado
 */
export async function trackProductView(input: TrackProductViewInput): Promise<void> {
  try {
    // Obtener la sesión actual
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      // Usuario no autenticado, no registramos la vista
      return;
    }

    const { productId, productSlug } = input;

    // Insertar en public.viewed_products
    const { error } = await supabase.from('viewed_products').insert({
      supabase_user_id: session.user.id,
      product_id: productId,
      product_slug: productSlug,
      // created_at se establece automáticamente por DEFAULT en la tabla
    });

    if (error) {
      console.error('[trackProductView] Error registrando vista:', error);
      // No lanzamos el error, solo lo registramos
      return;
    }

    console.log(`[trackProductView] Vista registrada: producto ${productId} (${productSlug})`);
  } catch (err) {
    console.error('[trackProductView] Error inesperado:', err);
    // No rompemos la UI si hay error
  }
}

/**
 * Obtiene los últimos N productos visitados por el usuario actual
 */
export async function getViewedProducts(limit: number = 8): Promise<
  Array<{
    id: number;
    product_id: number;
    product_slug: string;
    created_at: string;
  }>
> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return [];
    }

    const { data, error } = await supabase
      .from('viewed_products')
      .select('id, product_id, product_slug, created_at')
      .eq('supabase_user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getViewedProducts] Error obteniendo productos visitados:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[getViewedProducts] Error inesperado:', err);
    return [];
  }
}

/**
 * Limpia el historial de productos visitados del usuario actual
 */
export async function clearViewedProducts(): Promise<boolean> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return false;
    }

    const { error } = await supabase
      .from('viewed_products')
      .delete()
      .eq('supabase_user_id', session.user.id);

    if (error) {
      console.error('[clearViewedProducts] Error limpiando historial:', error);
      return false;
    }

    console.log('[clearViewedProducts] Historial limpiado');
    return true;
  } catch (err) {
    console.error('[clearViewedProducts] Error inesperado:', err);
    return false;
  }
}
