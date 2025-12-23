import React from 'react';
import { Check } from 'lucide-react';

interface ZoneOption {
  id: string;
  name: string;
  label: string;
  cost: number;
}

interface ZoneSelectorProps {
  availableZones: ZoneOption[];
  selectedZones: string[];
  onZoneChange: (zoneId: string) => void;
  disabled?: boolean;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  availableZones,
  selectedZones,
  onZoneChange,
  disabled = false
}) => {
  
  const handleToggle = (zoneId: string) => {
    if (disabled) return;
    onZoneChange(zoneId);
  };

  // Mapeo de iconos por zona
  const getZoneIcon = (zoneId: string): string => {
    const icons: Record<string, string> = {
      'frontal': '👕',
      'espalda': '🔄', 
      'dorsal': '🔄',
      'manga_izquierda': '👈',
      'manga_derecha': '👉'
    };
    return icons[zoneId] || '📍';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
        Zonas de Personalización
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {availableZones.map((zone) => {
          const isSelected = selectedZones.includes(zone.id);
          
          return (
            <button
              key={zone.id}
              onClick={() => handleToggle(zone.id)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              
              <span className="text-2xl mb-2 filter drop-shadow-sm">{getZoneIcon(zone.id)}</span>
              <span className="text-sm font-bold">{zone.label}</span>
              <span className="text-xs text-slate-500 mt-1 font-medium">
                +{zone.cost.toFixed(2)}€/ud
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ZoneSelector;
