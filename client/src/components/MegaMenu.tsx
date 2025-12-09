import { Link } from "wouter";
import { useState } from "react";

export interface MenuItem {
  title: string;
  href: string;
  items?: { label: string; href: string }[];
}

export interface MegaMenuSection {
  title: string;
  columns: MenuItem[];
  image?: { src: string; alt: string };
}

// Estructura actualizada con slugs únicos para evitar colisiones
export const menuData: Record<string, MegaMenuSection> = {
  "ropa-personalizada": {
    title: "Ropa Personalizada",
    columns: [
      {
        title: "CAMISETAS PERSONALIZADAS",
        href: "/camisetas-personalizadas",
        items: [
          { label: "Manga corta", href: "/camisetas-personalizadas/camiseta-manga-corta" },
          { label: "Manga larga", href: "/camisetas-personalizadas/camiseta-manga-larga" },
          { label: "Tirantes", href: "/camisetas-personalizadas/camiseta-tirantes" },
          { label: "Técnicas", href: "/camisetas-personalizadas/camiseta-tecnica" },
          { label: "Ecológicas", href: "/camisetas-personalizadas/camiseta-ecologica" },
          { label: "Deporte", href: "/camisetas-personalizadas/camiseta-deporte" },
        ]
      },
      {
        title: "SUDADERAS PERSONALIZADAS",
        href: "/sudaderas-personalizadas",
        items: [
          { label: "Con capucha", href: "/sudaderas-personalizadas/sudadera-con-capucha" },
          { label: "Sin capucha", href: "/sudaderas-personalizadas/sudadera-sin-capucha" },
          { label: "Alta visibilidad", href: "/sudaderas-personalizadas/sudadera-alta-visibilidad" },
        ]
      },
      {
        title: "POLOS PERSONALIZADOS",
        href: "/polos-personalizados",
        items: [
          { label: "Manga corta", href: "/polos-personalizados/polo-manga-corta" },
          { label: "Manga larga", href: "/polos-personalizados/polo-manga-larga" },
          { label: "Deportivos", href: "/polos-personalizados/polo-deportivo" },
        ]
      },
      {
        title: "CHAQUETAS Y ABRIGOS",
        href: "/chaquetas-personalizadas",
        items: [
          { label: "Softshell", href: "/chaquetas-personalizadas/chaqueta-softshell" },
          { label: "Polares", href: "/chaquetas-personalizadas/chaqueta-polar" },
          { label: "Cortavientos", href: "/chaquetas-personalizadas/chaqueta-cortavientos" },
          { label: "Abrigos", href: "/chaquetas-personalizadas/abrigo" },
        ]
      },
      {
        title: "ROPA LABORAL",
        href: "/ropa-laboral-personalizada",
        items: [
          { label: "Industria", href: "/ropa-laboral-personalizada/ropa-industria" },
          { label: "Alta visibilidad", href: "/ropa-laboral-personalizada/ropa-alta-visibilidad" },
          { label: "Sanidad", href: "/ropa-laboral-personalizada/ropa-sanidad" },
          { label: "Hostelería", href: "/ropa-laboral-personalizada/ropa-hosteleria" },
        ]
      }
    ],
  },
  "bolsas-mochilas": {
    title: "Bolsas y Mochilas",
    columns: [
      {
        title: "BOLSAS PERSONALIZADAS",
        href: "/bolsas-personalizadas",
        items: [
          { label: "Algodón", href: "/bolsas-personalizadas/bolsa-algodon" },
          { label: "Papel", href: "/bolsas-personalizadas/bolsa-papel" },
          { label: "Plegables", href: "/bolsas-personalizadas/bolsa-plegable" },
          { label: "Yute", href: "/bolsas-personalizadas/bolsa-yute" },
          { label: "Non-Woven", href: "/bolsas-personalizadas/bolsa-non-woven" },
          { label: "Para Botellas", href: "/bolsas-personalizadas/bolsa-botella" },
          { label: "Viaje", href: "/bolsas-personalizadas/bolsa-viaje" },
          { label: "Térmicas", href: "/bolsas-personalizadas/bolsa-termica" },
          { label: "Estancas", href: "/bolsas-personalizadas/bolsa-estanca" },
        ]
      },
      {
        title: "MOCHILAS PERSONALIZADAS",
        href: "/mochilas-personalizadas",
        items: [
          { label: "Estándar", href: "/mochilas-personalizadas/mochila-estandar" },
          { label: "Escolares", href: "/mochilas-personalizadas/mochila-escolar" },
          { label: "Portátil", href: "/mochilas-personalizadas/mochila-portatil" },
          { label: "Cuerdas", href: "/mochilas-personalizadas/mochila-cuerdas" },
        ]
      },
      {
        title: "ACCESORIOS VIAJE",
        href: "/accesorios-viaje",
        items: [
          { label: "Maletas", href: "/accesorios-viaje/maleta" },
        ]
      }
    ]
  },
  "tazas-botellas": {
    title: "Tazas y Botellas",
    columns: [
      {
        title: "TAZAS PERSONALIZADAS",
        href: "/tazas-personalizadas",
        items: [
          { label: "Cerámica", href: "/tazas-personalizadas/taza-ceramica" },
          { label: "Sublimación", href: "/tazas-personalizadas/taza-sublimacion" },
          { label: "Metálicas", href: "/tazas-personalizadas/taza-metalica" },
        ]
      },
      {
        title: "BOTELLAS PERSONALIZADAS",
        href: "/botellas-personalizadas",
        items: [
          { label: "Aluminio", href: "/botellas-personalizadas/botella-aluminio" },
          { label: "Térmicas", href: "/botellas-personalizadas/botella-termica" },
          { label: "Cristal", href: "/botellas-personalizadas/botella-cristal" },
        ]
      }
    ]
  },
  "merchandising": {
    title: "Merchandising",
    columns: [
      {
        title: "TECNOLOGÍA",
        href: "/tecnologia-personalizada",
        items: [
          { label: "Power Banks", href: "/tecnologia-personalizada/power-bank" },
          { label: "Altavoces", href: "/tecnologia-personalizada/altavoz" },
          { label: "Auriculares", href: "/tecnologia-personalizada/auriculares" },
          { label: "Memorias USB", href: "/tecnologia-personalizada/memoria-usb" },
        ]
      },
      {
        title: "ESCRITURA Y PAPELERÍA",
        href: "/escritura-personalizada",
        items: [
          { label: "Bolígrafos", href: "/escritura-personalizada/boligrafo" },
          { label: "Libretas", href: "/escritura-personalizada/libreta" },
          { label: "Carpetas", href: "/escritura-personalizada/carpeta" },
          { label: "Agendas", href: "/papeleria-personalizada/agenda" },
        ]
      },
      {
        title: "HOGAR Y DECORACIÓN",
        href: "/hogar-personalizado",
        items: [
          { label: "Cocina", href: "/hogar-personalizado/cocina" },
          { label: "Decoración", href: "/hogar-personalizado/decoracion" },
          { label: "Mantas", href: "/hogar-personalizado/manta" },
          { label: "Velas", href: "/hogar-personalizado/vela" },
        ]
      },
      {
        title: "EVENTOS",
        href: "/eventos-personalizados",
        items: [
          { label: "Lanyards", href: "/eventos-personalizados/lanyard" },
          { label: "Chapas", href: "/eventos-personalizados/chapa" },
          { label: "Pulseras", href: "/eventos-personalizados/pulsera" },
        ]
      },
      {
        title: "VERANO Y PLAYA",
        href: "/verano-personalizado",
        items: [
          { label: "Toallas", href: "/verano-personalizado/toalla-playa" },
          { label: "Sombrillas", href: "/verano-personalizado/sombrilla-playa" },
          { label: "Gafas de sol", href: "/verano-personalizado/gafas-sol" },
        ]
      }
    ]
  },
  "servicios": {
    title: "Servicios",
    columns: [
      {
        title: "SERIGRAFÍA",
        href: "/servicios/serigrafia",
        items: [{ label: "La serigrafía es una técnica de impresión...", href: "/servicios/serigrafia" }]
      },
      {
        title: "SUBLIMACIÓN",
        href: "/servicios/sublimacion",
        items: [{ label: "Ideal para ropa deportiva y técnica...", href: "/servicios/sublimacion" }]
      },
      {
        title: "BORDADO",
        href: "/servicios/bordado",
        items: [{ label: "Acabado premium y duradero...", href: "/servicios/bordado" }]
      },
      {
        title: "IMPRESIÓN DIGITAL",
        href: "/servicios/impresion-digital",
        items: [{ label: "Impresión a todo color sin límites...", href: "/servicios/impresion-digital" }]
      }
    ]
  }
};

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="hidden xl:flex items-center gap-8 font-bold text-[13px] uppercase tracking-wider text-slate-800 h-full">
      {Object.entries(menuData).map(([key, section]) => (
        <div 
          key={key}
          className="relative h-full flex items-center"
          onMouseEnter={() => setActiveMenu(key)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          {/* Contenedor visual del grupo principal - SIN LINK si no es Servicios */}
          <div 
            className={`flex items-center gap-1 py-6 cursor-default ${activeMenu === key ? 'text-blue-500' : ''}`}
          >
            {section.title} <span className="text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Dropdown Panel */}
          {activeMenu === key && (
            <div className="absolute top-full left-0 w-[90vw] max-w-7xl -translate-x-1/4 bg-white shadow-xl border-t-4 border-blue-400 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex p-8 gap-8">
                {/* Columns */}
                <div className="flex-1 grid grid-cols-4 gap-8">
                  {section.columns.map((col, idx) => (
                    <div key={idx}>
                      {key !== 'servicios' && (
                        <>
                          <Link href={col.href} className="block font-bold text-slate-900 mb-4 hover:text-blue-500">
                            {col.title}
                          </Link>
                          {col.items && (
                            <ul className="space-y-2">
                              {col.items.map((item, i) => (
                                <li key={i}>
                                  <Link href={item.href} className="text-slate-500 hover:text-blue-500 text-xs capitalize font-normal block py-1">
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                      {/* Special case for Services with images */}
                      {key === 'servicios' ? (
                        <div className="mt-0">
                           <Link href={col.href} className="block mb-3 overflow-hidden rounded-md">
                             <img 
                               src={`/images/services/${col.title.toLowerCase().replace(' ', '-').replace('ó', 'o').replace('í', 'i')}.jpg`} 
                               alt={col.title}
                               className="w-full h-32 object-cover hover:scale-105 transition-transform duration-500"
                               onError={(e) => {
                                 (e.target as HTMLImageElement).src = "https://placehold.co/300x200?text=" + col.title;
                               }}
                             />
                           </Link>
                           <Link href={col.href} className="block font-bold text-slate-900 mb-2 hover:text-blue-500 text-sm">
                             {col.title}
                           </Link>
                           {col.items && col.items.map((item, i) => (
                             <p key={i} className="text-[11px] text-slate-500 normal-case font-normal leading-relaxed">
                               {item.label}
                             </p>
                           ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Featured Image (Right Side) */}
                {section.image && (
                  <div className="w-64 flex-shrink-0">
                    <img src={section.image.src} alt={section.image.alt} className="w-full h-auto rounded shadow-sm" />
                    <p className="mt-2 text-center text-blue-500 font-medium text-xs">{section.image.alt}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
