import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CheckoutForm } from '@/components/CheckoutForm';
import { isStripeEnabled } from '@/config/stripeConfig';

export default function CheckoutPage() {
  const { cart, items, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Checkout | IMPACTO33</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-slate-50">
          <div className="container mx-auto py-12 px-4">
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600 text-lg mb-4">Tu carrito está vacío.</p>
              <Link href="/ropa-personalizada">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Volver al Catálogo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | IMPACTO33</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
            </div>
            <p className="text-blue-100">Resumen de tu pedido</p>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumen del pedido */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Resumen del Pedido</h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-4 border-b border-slate-200">
                      <div>
                        <h3 className="font-semibold text-slate-900">{item.product_name}</h3>
                        <p className="text-slate-600 text-sm">
                          {item.quantity} x {item.unit_price_with_vat.toFixed(2)} €
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        {item.total_with_vat.toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de envío */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Información de Envío</h2>
                <p className="text-slate-600 mb-4">
                  ⚠️ La configuración de direcciones de envío estará disponible en la siguiente fase.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 text-sm">
                    Por ahora, utilizaremos los datos de tu perfil para el envío. Puedes actualizar tu dirección en Mi Cuenta.
                  </p>
                </div>
              </div>

              {/* Métodos de pago */}
              <CheckoutForm cart={cart} items={items} loading={loading} />
            </div>

            {/* Resumen de totales */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-4">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Resumen de Totales</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{cart?.subtotal_without_vat.toFixed(2) || '0.00'} €</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>IVA (21%)</span>
                    <span>{cart?.vat_amount.toFixed(2) || '0.00'} €</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Envío</span>
                    <span className="text-green-600 font-semibold">Gratis</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-blue-600">{cart?.total_with_vat.toFixed(2) || '0.00'} €</span>
                  </div>
                </div>

                <button
                  disabled
                  className="w-full px-4 py-3 bg-slate-300 text-slate-600 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pagar (Próximamente)
                </button>

                <Link href="/carrito">
                  <button className="w-full mt-3 px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors font-semibold flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Carrito
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
