import { Link } from "wouter";
import { menuData, MenuItem } from "./MegaMenu";

interface RelatedCategoriesProps {
  currentUrl: string;
}

export function RelatedCategories({ currentUrl }: RelatedCategoriesProps) {
  // 1. Encontrar la sección y categoría actual en el menú
  let parentCategory: MenuItem | null = null;
  let siblingCategories: { label: string; href: string }[] = [];
  let isParentPage = false;

  // Normalizar URL actual (quitar barra final para comparación)
  const normalizedCurrentUrl = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;

  // Buscar en la estructura del menú
  Object.values(menuData).forEach((section) => {
    section.columns.forEach((col) => {
      // Normalizar URL de la columna (categoría madre)
      const normalizedColHref = col.href.endsWith('/') ? col.href.slice(0, -1) : col.href;

      // Caso A: Estamos en la página madre
      if (normalizedColHref === normalizedCurrentUrl) {
        isParentPage = true;
        parentCategory = col;
        // Las "hermanas" en este contexto son las hijas (subcategorías)
        if (col.items) {
          siblingCategories = col.items;
        }
      }

      // Caso B: Estamos en una página hija
      if (col.items) {
        const foundItem = col.items.find(item => {
          const normalizedItemHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
          return normalizedItemHref === normalizedCurrentUrl;
        });

        if (foundItem) {
          isParentPage = false;
          parentCategory = col;
          // Las hermanas son todos los items de la misma columna (excluyendo la actual si se desea, o incluyéndola para contexto)
          siblingCategories = col.items.filter(item => {
             const normalizedItemHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
             return normalizedItemHref !== normalizedCurrentUrl;
          });
        }
      }
    });
  });

  if (!parentCategory) {
    return null;
  }

  // Asegurar tipado para TypeScript
  const safeParentCategory = parentCategory as MenuItem;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-8">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          {isParentPage ? "Explora las subcategorías:" : `Más en ${safeParentCategory.title}:`}
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {/* Si es hija, mostrar enlace a la madre primero */}
          {!isParentPage && (
            <Link href={safeParentCategory.href}>
              <a className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm">
                ← Ver todo {safeParentCategory.title}
              </a>
            </Link>
          )}

          {/* Mostrar hermanas/hijas */}
          {siblingCategories.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <a className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm hover:border-blue-400 hover:text-blue-500 hover:shadow-md transition-all">
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
