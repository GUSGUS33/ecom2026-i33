import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, items, loading, removeItem, updateQuantity, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const handleRemoveItem = async (cartItemId: string) => {
    setRemovingId(cartItemId);
    try {
      await removeItem(cartItemId);
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(cartItemId);
    try {
      await updateQuantity(cartItemId, newQuantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      return;
    }

    setClearing(true);
    try {
      await clearCart();
    } finally {
      setClearing(false);
    }
  };

  const handleCheckout = () => {
    setLocation('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>Mi Carrito | IMPACTO33</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Mi Carrito</h1>
            </div>
            <p className="text-blue-100">
              {items.length} producto{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">Tu carrito está vacío.</p>
              <Link href="/ropa-personalizada">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Seguir Comprando
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tabla de items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  {/* Header */}
                  <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-900">
                    <div className="col-span-2">Producto</div>
                    <div>Cantidad</div>
                    <div className="text-right">Subtotal</div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-slate-200">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center"
                      >
                        {/* Producto */}
                        <div className="md:col-span-2 mb-4 md:mb-0">
                          <Link href={`/producto/${item.product_slug}`}>
                            <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                              {item.product_name}
                            </h3>
                          </Link>
                          <p className="text-slate-600 text-sm mt-1">
                            {item.unit_price_with_vat.toFixed(2)} € c/u
                          </p>
                        </div>

                        {/* Cantidad */}
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updatingId === item.id}
                            className="p-1 hover:bg-slate-100 rounded disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            disabled={updatingId === item.id}
                            className="w-12 px-2 py-1 border border-slate-300 rounded text-center disabled:opacity-50"
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updatingId === item.id}
                            className="p-1 hover:bg-slate-100 rounded disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between md:flex-col md:text-right">
                          <span className="md:hidden font-semibold">Subtotal:</span>
                          <span className="font-bold text-blue-600">
                            {item.total_with_vat.toFixed(2)} €
                          </span>
                        </div>

                        {/* Botón eliminar */}
                        <div className="mt-4 md:mt-0 md:col-span-4 flex justify-end">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removingId === item.id}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón vaciar */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <button
                      onClick={handleClearCart}
                      disabled={clearing}
                      className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                    >
                      {clearing ? 'Vaciando...' : 'Vaciar carrito'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Resumen */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-4">
                  <h2 className="text-lg font-bold text-slate-900 mb-6">Resumen</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>{cart?.subtotal_without_vat.toFixed(2) || '0.00'} €</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>IVA (21%)</span>
                      <span>{cart?.vat_amount.toFixed(2) || '0.00'} €</span>
                    </div>
                    <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-blue-600">{cart?.total_with_vat.toFixed(2) || '0.00'} €</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Ir al Checkout
                  </button>

                  <Link href="/ropa-personalizada">
                    <button className="w-full mt-3 px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors font-semibold">
                      Seguir Comprando
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
