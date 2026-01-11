import { supabase } from '@/lib/supabaseClient';

export interface WishlistItem {
  id: number;
  productId: number;
  createdAt: string;
}

/**
 * Obtiene todos los productos en la wishlist del usuario actual
 */
export async function getWishlistForCurrentUser(limit?: number): Promise<WishlistItem[]> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return [];
    }

    let query = supabase
      .from('wishlist_impacto33')
      .select('id, product_id, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[getWishlistForCurrentUser] Error obteniendo wishlist:', error);
      return [];
    }

    // Mapear snake_case de Supabase a camelCase
    return (data as any[])?.map(item => ({
      id: item.id,
      productId: item.product_id,
      createdAt: item.created_at,
    })) || [];
  } catch (err) {
    console.error('[getWishlistForCurrentUser] Error inesperado:', err);
    return [];
  }
}

/**
 * Verifica si un producto específico está en la wishlist del usuario
 */
export async function isProductInWishlist(productId: number): Promise<boolean> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return false;
    }

    const { data, error } = await supabase
      .from('wishlist_impacto33')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('product_id', productId)
      .limit(1);

    if (error) {
      console.error('[isProductInWishlist] Error verificando wishlist:', error);
      return false;
    }

    return (data && data.length > 0) || false;
  } catch (err) {
    console.error('[isProductInWishlist] Error inesperado:', err);
    return false;
  }
}

/**
 * Alterna un producto en la wishlist (añade si no está, elimina si está)
 * Retorna true si el producto fue añadido, false si fue eliminado
 */
export async function toggleWishlistProduct(
  productId: number,
  productSlug: string
): Promise<boolean | null> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.warn('[toggleWishlistProduct] Usuario no autenticado');
      return null;
    }

    // Validar que productId es un número válido
    if (!Number.isFinite(productId) || productId <= 0) {
      console.error('[toggleWishlistProduct] productId inválido:', productId);
      return null;
    }

    // Verificar si el producto ya está en la wishlist
    const isInWishlist = await isProductInWishlist(productId);

    if (isInWishlist) {
      // Eliminar de la wishlist
      const { error } = await supabase
        .from('wishlist_impacto33')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('[toggleWishlistProduct] Error eliminando de wishlist:', error);
        return null;
      }

      console.log(`[toggleWishlistProduct] Producto ${productId} eliminado de wishlist`);
      return false;
    } else {
      // Añadir a la wishlist
      const { error } = await supabase.from('wishlist_impacto33').insert({
        user_id: session.user.id,
        product_id: productId,
      });

      if (error) {
        console.error('[toggleWishlistProduct] Error añadiendo a wishlist:', error);
        return null;
      }

      console.log(`[toggleWishlistProduct] Producto ${productId} añadido a wishlist`);
      return true;
    }
  } catch (err) {
    console.error('[toggleWishlistProduct] Error inesperado:', err);
    return null;
  }
}

/**
 * Añade un producto a la wishlist
 */
export async function addToWishlist(productId: number, productSlug: string): Promise<boolean> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return false;
    }

    // Validar que productId es un número válido
    if (!Number.isFinite(productId) || productId <= 0) {
      console.error('[addToWishlist] productId inválido:', productId);
      return false;
    }

    const { error } = await supabase.from('wishlist_impacto33').insert({
      user_id: session.user.id,
      product_id: productId,
    });

    if (error) {
      console.error('[addToWishlist] Error añadiendo a wishlist:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[addToWishlist] Error inesperado:', err);
    return false;
  }
}

/**
 * Elimina un producto de la wishlist
 */
export async function removeFromWishlist(productId: number): Promise<boolean> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return false;
    }

    const { error } = await supabase
      .from('wishlist_impacto33')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('[removeFromWishlist] Error eliminando de wishlist:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[removeFromWishlist] Error inesperado:', err);
    return false;
  }
}

/**
 * Limpia toda la wishlist del usuario actual
 */
export async function clearWishlist(): Promise<boolean> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return false;
    }

    const { error } = await supabase
      .from('wishlist_impacto33')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error('[clearWishlist] Error limpiando wishlist:', error);
      return false;
    }

    console.log('[clearWishlist] Wishlist limpiada');
    return true;
  } catch (err) {
    console.error('[clearWishlist] Error inesperado:', err);
    return false;
  }
}
