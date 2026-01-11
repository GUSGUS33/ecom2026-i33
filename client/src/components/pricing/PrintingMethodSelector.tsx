import React from 'react';
import { PRINTING_METHODS } from '../../data/pricing/printing-methods';
import type { PrintingMethodId } from '../../types/printing';

interface PrintingMethodSelectorProps {
  /** Métodos activos disponibles */
  activeMethods: PrintingMethodId[];
  
  /** Método seleccionado actualmente */
  selectedMethod: PrintingMethodId;
  
  /** Callback cuando se selecciona un método */
  onMethodChange: (methodId: PrintingMethodId) => void;
  
  /** Mostrar métodos inactivos como opciones deshabilitadas */
  showInactiveMethods?: boolean;
  
  /** Métodos disponibles (activos + inactivos) */
  availableMethods?: PrintingMethodId[];
}

/**
 * Selector de método de impresión con soporte para métodos activos e inactivos
 * 
 * Muestra botones tipo "pill" con iconos para cada método.
 * Los métodos inactivos aparecen deshabilitados con etiqueta "Próximamente".
 */
const PrintingMethodSelector: React.FC<PrintingMethodSelectorProps> = ({
  activeMethods,
  selectedMethod,
  onMethodChange,
  showInactiveMethods = true,
  availableMethods = []
}) => {
  // Obtener todos los métodos permitidos (activos + inactivos)
  const allMethods = showInactiveMethods && availableMethods.length > 0
    ? availableMethods
    : activeMethods;

  // Iconos para cada método
  const methodIcons: Record<PrintingMethodId, string> = {
    'DTF': '🖨️',
    'SERIGRAFIA_1_COLOR': '🎨',
    'BORDADO': '🧵',
    'DTF_UV': '☀️',
    'TAMPO_1_COLOR': '🔴',
    'SIN_IMPRESION': '👕'
  };

  // Mensajes de tooltip para métodos inactivos
  const inactiveTooltips: Record<PrintingMethodId, string> = {
    'DTF': 'Próximamente disponible',
    'SERIGRAFIA_1_COLOR': 'Próximamente disponible',
    'BORDADO': 'Próximamente disponible',
    'DTF_UV': 'Próximamente disponible',
    'TAMPO_1_COLOR': 'Próximamente disponible',
    'SIN_IMPRESION': 'Próximamente disponible'
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
        Método de Impresión
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {allMethods.map((methodId) => {
          const method = PRINTING_METHODS[methodId];
          if (!method) return null;

          const isActive = activeMethods.includes(methodId);
          const isSelected = selectedMethod === methodId;
          const icon = methodIcons[methodId] || '📌';

          return (
            <button
              key={methodId}
              onClick={() => {
                if (isActive) {
                  onMethodChange(methodId);
                }
              }}
              disabled={!isActive}
              className={`
                relative px-4 py-3 rounded-full font-medium text-sm
                transition-all duration-200 flex items-center gap-2
                ${isActive
                  ? isSelected
                    ? 'bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700'
                    : 'bg-white border-2 border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50'
                  : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed opacity-60 relative group'
                }`
              }
              title={!isActive ? inactiveTooltips[methodId] : method.label}
            >
              <span className="text-lg leading-none">{icon}</span>
              
              <div className="flex flex-col items-start">
                <span className="font-semibold">{method.label}</span>
                {!isActive && (
                  <span className="text-xs font-medium opacity-75">Próximamente</span>
                )}
              </div>

              {/* Tooltip mejorado para métodos inactivos */}
              {!isActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  {inactiveTooltips[methodId]}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
                </div>
              )}

              {isSelected && isActive && (
                <span className="ml-auto text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Información adicional sobre el método seleccionado */}
      <div className="mt-4 space-y-2">
        {PRINTING_METHODS[selectedMethod] && (
          <p className="text-xs text-slate-600 italic">
            {PRINTING_METHODS[selectedMethod].description}
          </p>
        )}
        
        {/* Mensaje informativo sobre disponibilidad */}
        {activeMethods.length === 1 && (
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-3 py-2">
            ℹ️ De momento este producto solo está disponible con impresión <strong>DTF Full Color</strong>. Próximamente añadiremos más opciones de personalización.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrintingMethodSelector;
