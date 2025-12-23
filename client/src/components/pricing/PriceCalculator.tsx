import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, FileText, Check } from 'lucide-react';
import type { PriceCalculation } from '../../types/pricing';
import { formatEuroPrice } from '../../services/pricingService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PriceCalculatorProps {
  priceCalculation: PriceCalculation | null;
  selectedColor?: string;
  showDetailedBreakdown?: boolean;
  onRequestQuote?: () => void;
  isValid?: boolean;
  loading?: boolean;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  priceCalculation,
  selectedColor,
  showDetailedBreakdown = false,
  onRequestQuote,
  isValid = true,
  loading = false
}) => {
  const [showBreakdown, setShowBreakdown] = useState(showDetailedBreakdown);

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-xl p-6 animate-pulse space-y-4 border border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
        <div className="h-20 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (!priceCalculation) {
    return (
      <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 border-dashed">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
          <FileText size={24} />
        </div>
        <h3 className="text-slate-900 font-medium mb-1">Calculadora de Presupuesto</h3>
        <p className="text-slate-500 text-sm">
          Selecciona cantidad y zonas de personalización para ver el precio estimado.
        </p>
      </div>
    );
  }

  const {
    precioUnitarioBase,
    precioPersonalizacion,
    precioUnitarioFinal,
    precioTotalSinIVA,
    precioTotalConIVA,
    cantidadTotal,
    cantidadMinima,
    cumpleCantidadMinima,
    escalado,
    zonasSeleccionadas
  } = priceCalculation;

  // Alerta de cantidad mínima
  if (!cumpleCantidadMinima) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="text-amber-600 shrink-0 mt-1" size={24} />
        <div>
          <h3 className="text-amber-800 font-bold text-lg mb-1">Cantidad mínima no alcanzada</h3>
          <p className="text-amber-700 mb-4">
            La cantidad mínima para este producto es de <strong>{cantidadMinima} unidades</strong>. 
            Actualmente has seleccionado {cantidadTotal}.
          </p>
          <div className="text-sm text-amber-600 font-medium">
            Añade {cantidadMinima - cantidadTotal} unidades más para ver el precio.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header con Precio Total */}
      <div className="p-6 bg-slate-50 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-1">Precio Total Estimado</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{formatEuroPrice(precioTotalSinIVA)}</span>
              <span className="text-sm text-slate-500 font-medium">+ IVA</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ({formatEuroPrice(precioTotalConIVA)} IVA incluido)
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-1">Precio Unitario</p>
            <span className="text-xl font-bold text-blue-600">{formatEuroPrice(precioUnitarioFinal)}</span>
            <p className="text-xs text-slate-400 mt-1">/unidad</p>
          </div>
        </div>

        {/* Badge de Escalado */}
        {escalado < 1 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold border border-green-200">
            <Check size={14} strokeWidth={3} />
            <span>Descuento por volumen aplicado: {Math.round((1 - escalado) * 100)}% OFF</span>
          </div>
        )}
      </div>

      {/* Desglose Expandible */}
      <div className="border-b border-slate-100">
        <button 
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between p-4 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span className="font-medium flex items-center gap-2">
            {showBreakdown ? 'Ocultar desglose' : 'Ver desglose detallado'}
          </span>
          {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showBreakdown && (
          <div className="p-4 bg-slate-50/50 space-y-3 text-sm border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Precio base producto:</span>
              <span>{formatEuroPrice(precioUnitarioBase)}</span>
            </div>
            
            <div className="flex justify-between text-slate-600">
              <span>Personalización ({zonasSeleccionadas.length} zonas):</span>
              <span>+{formatEuroPrice(precioPersonalizacion)}</span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium pt-2 border-t border-slate-200">
              <span>Subtotal unitario:</span>
              <span>{formatEuroPrice(precioUnitarioBase + precioPersonalizacion)}</span>
            </div>

            <div className="flex justify-between text-green-600 pt-1">
              <span>Factor de escalado ({cantidadTotal} uds):</span>
              <span>x{escalado.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="p-6 bg-white">
        {onRequestQuote && (
          <Button 
            onClick={onRequestQuote}
            disabled={!isValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-bold rounded-lg shadow-md shadow-blue-200 flex items-center justify-center gap-2"
          >
            <FileText size={20} />
            SOLICITAR PRESUPUESTO
          </Button>
        )}
        <p className="text-center text-xs text-slate-400 mt-4">
          * Precios válidos salvo error tipográfico. El presupuesto final puede variar según complejidad del diseño.
        </p>
      </div>
    </div>
  );
};

export default PriceCalculator;
