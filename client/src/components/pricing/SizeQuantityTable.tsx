import React from 'react';

interface SizeQuantityOption {
  size: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  stockQuantity: number;
  price: number;
  variationId?: string;
}

interface SizeQuantityTableProps {
  sizeOptions: SizeQuantityOption[];
  quantities: Record<string, number>;
  onQuantityChange: (size: string, quantity: number) => void;
  disabled?: boolean;
  title?: string;
}

const SizeQuantityTable: React.FC<SizeQuantityTableProps> = ({
  sizeOptions,
  quantities,
  onQuantityChange,
  disabled = false,
  title = "Introduce Cantidades"
}) => {
  // Ordenar tallas de forma lógica (XS -> 4XL)
  const sortedSizes = [...sizeOptions].sort((a, b) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL'];
    
    // Normalizar tallas para comparación (quitar espacios, mayúsculas)
    const normA = a.size.toUpperCase().trim();
    const normB = b.size.toUpperCase().trim();
    
    const aIndex = sizeOrder.indexOf(normA);
    const bIndex = sizeOrder.indexOf(normB);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    return normA.localeCompare(normB);
  });

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Header rojo corporativo */}
      <div className="bg-red-600 text-white px-4 py-3 rounded-t-xl shadow-sm flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          {title}
        </h3>
        <span className="text-xs bg-white/20 px-2 py-1 rounded text-white font-medium">
          Stock en tiempo real
        </span>
      </div>
      
      {/* Tabla */}
      <div className="border border-slate-200 border-t-0 rounded-b-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead className="bg-slate-50">
              <tr>
                {sortedSizes.map((size) => (
                  <th 
                    key={size.size}
                    className="px-2 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200"
                  >
                    {size.size}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              <tr>
                {sortedSizes.map((sizeOption) => {
                  const currentQuantity = quantities[sizeOption.size] || 0;
                  const isOutOfStock = sizeOption.stockStatus === 'OUT_OF_STOCK' || sizeOption.stockQuantity <= 0;
                  const maxStock = sizeOption.stockQuantity || 0;
                  const isLowStock = !isOutOfStock && maxStock < 10;
                  
                  return (
                    <td 
                      key={sizeOption.size}
                      className={`px-2 py-4 text-center border-r border-slate-100 last:border-r-0 transition-colors ${
                        currentQuantity > 0 ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {isOutOfStock ? (
                        <div className="flex flex-col items-center justify-center h-[60px]">
                          <span className="text-xs font-bold text-slate-300 line-through mb-1">0</span>
                          <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            AGOTADO
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          {/* Input de cantidad */}
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max={maxStock}
                              value={currentQuantity || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const newQuantity = val === '' ? 0 : parseInt(val);
                                if (!isNaN(newQuantity)) {
                                  onQuantityChange(sizeOption.size, Math.max(0, Math.min(newQuantity, maxStock)));
                                }
                              }}
                              disabled={disabled}
                              className={`
                                w-16 h-10 border-2 rounded-lg text-center font-bold text-lg outline-none transition-all
                                ${currentQuantity > 0 
                                  ? 'border-blue-500 text-blue-700 bg-white shadow-md shadow-blue-100' 
                                  : 'border-slate-200 text-slate-700 hover:border-slate-300 focus:border-blue-400'
                                }
                                ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : ''}
                              `}
                              placeholder="0"
                            />
                          </div>
                          
                          {/* Stock en tiempo real */}
                          <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                            isLowStock 
                              ? 'text-amber-600 bg-amber-50 border-amber-100' 
                              : 'text-green-600 bg-green-50 border-green-100'
                          }`}>
                            {maxStock} disp.
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Footer de la tabla */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Stock disponible
            <span className="w-2 h-2 rounded-full bg-red-500 ml-2"></span> Agotado
          </div>
          
          {Object.values(quantities).reduce((a, b) => a + b, 0) > 0 && (
            <div className="text-sm font-bold text-blue-700 animate-pulse">
              Total: {Object.values(quantities).reduce((a, b) => a + b, 0)} uds.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeQuantityTable;
