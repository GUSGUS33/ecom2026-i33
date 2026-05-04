import { describe, it, expect, vi } from 'vitest';

/**
 * Tests para verificar los fixes aplicados en useCart.ts
 * 
 * Fix principal: La función updateQuantity del hook llamaba a sí misma
 * en lugar de llamar a updateItemQuantity del servicio (shadow de nombre).
 * Se renombró el import a updateItemQuantityService para evitar la recursión.
 */

// Mock de los servicios del carrito
vi.mock('@/services/cartService', () => ({
  getOrCreateActiveCartForUser: vi.fn(),
  getCartWithItems: vi.fn(),
  addItem: vi.fn(),
  updateItemQuantity: vi.fn(),
  removeItem: vi.fn(),
  clearCart: vi.fn(),
}));

// Mock de AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id', email: 'test@test.com' },
    loading: false,
  })),
}));

describe('useCart - Import naming fix', () => {
  it('should import updateItemQuantity as updateItemQuantityService to avoid recursion', async () => {
    // Leer el archivo fuente para verificar que el import está correcto
    const fs = await import('fs');
    const path = await import('path');
    
    const hookPath = path.resolve(__dirname, 'useCart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');
    
    // Verificar que el import renombrado existe
    expect(content).toContain('updateItemQuantity as updateItemQuantityService');
    
    // Verificar que la función updateQuantity del hook llama al servicio renombrado
    expect(content).toContain('await updateItemQuantityService(');
    
    // Verificar que NO hay llamada recursiva directa a updateItemQuantity(
    // dentro de la función del hook (excluyendo la línea de import)
    const lines = content.split('\n');
    const hookFunctionLines = lines.filter(line => 
      !line.includes('import') && 
      !line.includes('updateItemQuantityService') &&
      line.includes('updateItemQuantity(')
    );
    
    // No debería haber ninguna llamada a updateItemQuantity sin el sufijo Service
    expect(hookFunctionLines.length).toBe(0);
  });

  it('should import removeItem as removeItemFromCart to avoid shadow', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const hookPath = path.resolve(__dirname, 'useCart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');
    
    // Verificar que removeItem está renombrado en el import
    expect(content).toContain('removeItem as removeItemFromCart');
    
    // Verificar que se usa el nombre renombrado en la implementación
    expect(content).toContain('await removeItemFromCart(');
  });

  it('should import clearCart as clearCartFromDB to avoid shadow', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const hookPath = path.resolve(__dirname, 'useCart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');
    
    // Verificar que clearCart está renombrado en el import
    expect(content).toContain('clearCart as clearCartFromDB');
    
    // Verificar que se usa el nombre renombrado en la implementación
    expect(content).toContain('await clearCartFromDB(');
  });

  it('should import addItem as addItemToCart to avoid shadow', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const hookPath = path.resolve(__dirname, 'useCart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');
    
    // Verificar que addItem está renombrado en el import
    expect(content).toContain('addItem as addItemToCart');
    
    // Verificar que se usa el nombre renombrado en la implementación
    expect(content).toContain('await addItemToCart(');
  });
});

describe('useCart - Hook exports', () => {
  it('should export all required functions and state', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const hookPath = path.resolve(__dirname, 'useCart.ts');
    const content = fs.readFileSync(hookPath, 'utf-8');
    
    // Verificar que el hook exporta todas las funciones necesarias
    expect(content).toContain('cart: state.cart');
    expect(content).toContain('items: state.items');
    expect(content).toContain('loading: state.loading');
    expect(content).toContain('error: state.error');
    expect(content).toContain('itemCount');
    expect(content).toContain('isEmpty');
    expect(content).toContain('addItem');
    expect(content).toContain('updateQuantity');
    expect(content).toContain('removeItem');
    expect(content).toContain('clearCart');
    expect(content).toContain('reload: loadCart');
  });
});
