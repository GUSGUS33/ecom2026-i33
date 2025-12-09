import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ProductFiltersProps {
  minPrice?: number;
  maxPrice?: number;
  attributes?: {
    id: string;
    name: string;
    options: FilterOption[];
  }[];
  onFilterChange: (filters: any) => void;
  className?: string;
}

export function ProductFilters({
  minPrice = 0,
  maxPrice = 100,
  attributes = [],
  onFilterChange,
  className = "",
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({ price: value, attributes: selectedAttributes });
  };

  const handleAttributeChange = (attributeId: string, optionId: string, checked: boolean) => {
    const currentSelected = selectedAttributes[attributeId] || [];
    let newSelected;

    if (checked) {
      newSelected = [...currentSelected, optionId];
    } else {
      newSelected = currentSelected.filter((id) => id !== optionId);
    }

    const newAttributes = {
      ...selectedAttributes,
      [attributeId]: newSelected,
    };

    setSelectedAttributes(newAttributes);
    onFilterChange({ price: priceRange, attributes: newAttributes });
  };

  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedAttributes({});
    onFilterChange({ price: [minPrice, maxPrice], attributes: {} });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900">Filtros</h3>
        {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice || Object.keys(selectedAttributes).some(k => selectedAttributes[k].length > 0)) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
          >
            <X size={14} className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["price", ...attributes.map(a => a.id)]} className="w-full">
        {/* Filtro de Precio */}
        <AccordionItem value="price" className="border-b-slate-200">
          <AccordionTrigger className="text-sm font-semibold text-slate-800 hover:no-underline py-3">
            Precio
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6 px-1">
            <Slider
              defaultValue={[minPrice, maxPrice]}
              value={priceRange}
              max={maxPrice}
              min={minPrice}
              step={1}
              onValueChange={handlePriceChange}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                {priceRange[0]}€
              </span>
              <span className="text-slate-400">-</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                {priceRange[1]}€
              </span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtros de Atributos Dinámicos */}
        {attributes.map((attr) => (
          <AccordionItem key={attr.id} value={attr.id} className="border-b-slate-200">
            <AccordionTrigger className="text-sm font-semibold text-slate-800 hover:no-underline py-3 capitalize">
              {attr.name}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-3">
                {attr.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${attr.id}-${option.id}`} 
                      checked={(selectedAttributes[attr.id] || []).includes(option.id)}
                      onCheckedChange={(checked) => 
                        handleAttributeChange(attr.id, option.id, checked as boolean)
                      }
                      className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label 
                      htmlFor={`${attr.id}-${option.id}`}
                      className="text-sm text-slate-600 cursor-pointer flex-1 flex justify-between"
                    >
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-xs text-slate-400">({option.count})</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
