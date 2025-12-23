import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../../../../shared/types';
import { PriceCalculationResult } from '../../hooks/usePriceCalculation';
import { useQuote } from '../../contexts/QuoteContext';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColor: string;
  selectedColorVariations: any[];
  quantities: Record<string, number>;
  priceCalculation: PriceCalculationResult;
  selectedZones: string[];
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedColor,
  selectedColorVariations,
  quantities,
  priceCalculation,
  selectedZones
}) => {
  const { submitQuote } = useQuote();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitQuote({
        customer: formData,
        product: {
          id: product.id,
          name: product.name,
          sku: '', // Product no tiene SKU directo en la interfaz, usar vacío o buscar en variaciones
          image: product.featuredImage?.node?.sourceUrl || '',
          selectedColor,
          quantities,
          selectedZones
        },
        pricing: priceCalculation
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
      }, 4000);
    } catch (err) {
      setError('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener imagen del color seleccionado
  const colorImage = selectedColorVariations[0]?.image?.sourceUrl || product.featuredImage?.node?.sourceUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          
          {/* Columna Izquierda: Resumen del Pedido */}
          <div className="bg-muted/30 p-6 border-r flex flex-col h-full overflow-hidden">
            <DialogHeader className="mb-4">
              <DialogTitle>Resumen de tu Presupuesto</DialogTitle>
              <DialogDescription>Revisa los detalles de tu solicitud.</DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Producto */}
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-md overflow-hidden border bg-white shrink-0">
                    <img 
                      src={colorImage} 
                      alt={product.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Color: <span className="font-medium text-foreground">{selectedColor}</span></p>
                    <p className="text-sm text-muted-foreground">Ref: {product.id || 'N/A'}</p>
                  </div>
                </div>

                {/* Desglose de Cantidades */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Desglose por Talla</h5>
                  <div className="bg-white rounded-md border p-3 text-sm space-y-1">
                    {Object.entries(quantities).map(([size, qty]) => {
                      if (qty <= 0) return null;
                      const unitPrice = priceCalculation.precioUnitarioFinal;
                      const total = qty * unitPrice;
                      return (
                        <div key={size} className="flex justify-between">
                          <span>Talla {size} ({qty} uds.)</span>
                          <span className="text-muted-foreground">{qty} × {unitPrice.toFixed(2)}€ = {total.toFixed(2)}€</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Personalización */}
                {selectedZones.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Personalización</h5>
                    <div className="bg-white rounded-md border p-3 text-sm">
                      <div className="flex justify-between">
                        <span>Zonas: {selectedZones.join(', ')}</span>
                        <span className="text-muted-foreground">Incluido en precio</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Totales */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{priceCalculation.precioTotalSinIVA.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (21%)</span>
                    <span>{(priceCalculation.precioTotalConIVA - priceCalculation.precioTotalSinIVA).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>TOTAL</span>
                    <span className="text-primary">{priceCalculation.precioTotalConIVA.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="p-6 flex flex-col h-full overflow-y-auto">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">¡ENVIO REALIZADO CON EXITO !</h3>
                <p className="text-muted-foreground">
                  Hemos recibido tu solicitud correctamente. Te enviaremos el presupuesto detallado a <strong>{formData.email}</strong> en menos de 24 horas.
                </p>
                <p className="text-xs text-muted-foreground mt-4">Esta ventana se cerrará automáticamente...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Datos de Contacto</h3>
                  <p className="text-sm text-muted-foreground">Completa el formulario para recibir tu presupuesto.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input 
                        id="company" 
                        name="company" 
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Opcional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje adicional</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="¿Alguna instrucción especial o duda?"
                      className="min-h-[100px]"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <div className="pt-4 mt-auto">
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando solicitud...
                        </>
                      ) : (
                        'Solicitar Presupuesto'
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Respuesta en &lt; 24h. Sin compromiso de compra.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
