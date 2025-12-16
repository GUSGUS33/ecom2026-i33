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

// Estructura actualizada y coherente con el sitemap completo
export const menuData: Record<string, MegaMenuSection> = {
  "ropa-personalizada": {
    title: "Ropa Personalizada",
    columns: [
      {
        title: "CAMISETAS PERSONALIZADAS",
        href: "/camisetas-personalizadas",
        items: [
          { label: "Manga corta", href: "/camisetas-personalizadas/camisetas-manga-corta" },
          { label: "Manga larga", href: "/camisetas-personalizadas/camisetas-manga-larga" },
          { label: "Tirantes", href: "/camisetas-personalizadas/camisetas-tirantes" },
          { label: "Técnicas", href: "/camisetas-personalizadas/camisetas-tecnicas" },
          { label: "Ecológicas", href: "/camisetas-personalizadas/camisetas-ecologicas" },
          { label: "Deporte", href: "/camisetas-personalizadas/camisetas-deporte" },
          { label: "Industria", href: "/camisetas-personalizadas/camisetas-industria" },
          { label: "Ignífugas", href: "/camisetas-personalizadas/camisetas-ignifugas" },
          { label: "Reflectantes", href: "/camisetas-personalizadas/camisetas-reflectantes" },
          { label: "Roly Dry", href: "/camisetas-personalizadas/camisetas-roly-dry" },
        ],
      },
      {
        title: "SUDADERAS PERSONALIZADAS",
        href: "/sudaderas-personalizadas",
        items: [
          { label: "Con capucha", href: "/sudaderas-personalizadas/sudaderas-con-capucha" },
          { label: "Sin capucha", href: "/sudaderas-personalizadas/sudaderas-clasica-sin-capucha" },
          { label: "Alta visibilidad", href: "/sudaderas-personalizadas/sudaderas-alta-visibilidad" },
          { label: "Baratas", href: "/sudaderas-personalizadas/sudaderas-baratas" },
          { label: "Para empresas", href: "/sudaderas-personalizadas/sudaderas-para-empresas" },
          { label: "Para grupos", href: "/sudaderas-personalizadas/sudaderas-para-grupos" },
          { label: "Bordadas", href: "/sudaderas-personalizadas/sudaderas-bordadas" },
        ],
      },
      {
        title: "POLOS PERSONALIZADOS",
        href: "/polos-personalizados",
        items: [
          { label: "Manga corta", href: "/polos-personalizados/polos-manga-corta" },
          { label: "Manga larga", href: "/polos-personalizados/polos-manga-larga" },
          { label: "Deportivos", href: "/polos-personalizados/polos-deportivos" },
          { label: "Industria", href: "/polos-personalizados/polos-industria" },
          { label: "Ignífugos", href: "/polos-personalizados/polos-ignifugos" },
          { label: "Reflectantes", href: "/polos-personalizados/polos-reflectantes" },
        ],
      },
      {
        title: "CHAQUETAS Y ABRIGOS",
        href: "/chaquetas-personalizadas",
        items: [
          { label: "Abrigos", href: "/chaquetas-personalizadas/abrigos" },
          { label: "Softshell", href: "/chaquetas-personalizadas/chaquetas-softshell" },
          { label: "Polares", href: "/chaquetas-personalizadas/chaquetas-polares" },
          { label: "Cortavientos", href: "/chaquetas-personalizadas/chaquetas-cortaviento" },
          { label: "Impermeables", href: "/chaquetas-personalizadas/chaquetas-impermeables" },
          { label: "Ignífugas", href: "/chaquetas-personalizadas/chaquetas-ignifugas" },
          { label: "Horeca", href: "/chaquetas-personalizadas/chaquetas-horeca" },
        ],
      },
      {
        title: "PANTALONES",
        href: "/pantalones-personalizados",
        items: [
          { label: "Largos", href: "/pantalones-personalizados/pantalones-largos" },
          { label: "Deportivos", href: "/pantalones-personalizados/pantalones-deportivos" },
          { label: "Ignífugos", href: "/pantalones-personalizados/pantalones-ignifugos" },
          { label: "Industria", href: "/pantalones-personalizados/pantalones-industria" },
          { label: "Alimentación", href: "/pantalones-personalizados/pantalones-alimentacion" },
          { label: "Horeca", href: "/pantalones-personalizados/pantalones-horeca" },
          { label: "Sanitarios", href: "/pantalones-personalizados/pantalones-sanitarios" },
        ],
      },
      {
        title: "MONOS Y VESTUARIO LABORAL",
        href: "/vestuario-laboral",
        items: [
          { label: "Monos industria", href: "/monos-personalizados/monos-industria" },
          { label: "Monos ignífugos", href: "/monos-personalizados/monos-ignifugos" },
          { label: "Industria", href: "/vestuario-laboral/industria" },
          { label: "Alimentaria", href: "/vestuario-laboral/alimentaria" },
          { label: "Sanidad", href: "/vestuario-laboral/sanidad" },
          { label: "Hostelería", href: "/vestuario-laboral/hosteleria" },
          { label: "Alta visibilidad", href: "/vestuario-laboral/alta-visibilidad" },
          { label: "Ignífuga", href: "/vestuario-laboral/ignifuga" },
        ],
      },
    ],
  },

  "bolsas-mochilas": {
    title: "Bolsas y Mochilas",
    columns: [
      {
        title: "BOLSAS PERSONALIZADAS",
        href: "/bolsas-personalizadas",
        items: [
          { label: "Algodón", href: "/bolsas-personalizadas/bolsas-algodon" },
          { label: "Papel", href: "/bolsas-personalizadas/bolsas-papel" },
          { label: "Plegables", href: "/bolsas-personalizadas/bolsas-plegables" },
          { label: "Yute", href: "/bolsas-personalizadas/bolsas-yute" },
          { label: "Non-Woven", href: "/bolsas-personalizadas/bolsas-non-woven" },
          { label: "Para botellas", href: "/bolsas-personalizadas/bolsas-botella" },
          { label: "Viaje", href: "/bolsas-personalizadas/bolsas-viaje" },
          { label: "Térmicas", href: "/bolsas-personalizadas/bolsas-termicas" },
          { label: "Estancas", href: "/bolsas-personalizadas/bolsas-estancas" },
          { label: "Baratas", href: "/bolsas-personalizadas/bolsas-baratas" },
          { label: "Para tiendas", href: "/bolsas-personalizadas/bolsas-para-tiendas" },
          { label: "Regalo", href: "/bolsas-personalizadas/bolsas-regalo" },
          { label: "Al por mayor", href: "/bolsas-personalizadas/bolsas-al-por-mayor" },
        ],
      },
      {
        title: "MOCHILAS PERSONALIZADAS",
        href: "/mochilas-personalizadas",
        items: [
          { label: "Estándar", href: "/mochilas-personalizadas/mochilas-estandar" },
          { label: "Escolares", href: "/mochilas-personalizadas/mochilas-escolar" },
          { label: "Portátil", href: "/mochilas-personalizadas/mochilas-portatil" },
          { label: "Cuerdas", href: "/mochilas-personalizadas/mochilas-cuerdas" },
          { label: "Baratas", href: "/mochilas-personalizadas/mochilas-baratas" },
          { label: "Para empresas", href: "/mochilas-personalizadas/mochilas-para-empresas" },
          { label: "Infantiles", href: "/mochilas-personalizadas/mochilas-infantiles" },
          { label: "Deportivas", href: "/mochilas-personalizadas/mochilas-deportivas" },
        ],
      },
      {
        title: "ACCESORIOS DE VIAJE",
        href: "/accesorios-viaje",
        items: [
          { label: "Maletas", href: "/accesorios-viaje/maletas" },
          { label: "Neceser", href: "/accesorios-viaje/neceser" },
          { label: "Identificador maleta", href: "/accesorios-viaje/identificador-maleta" },
        ],
      },
    ],
  },

  "tazas-botellas": {
    title: "Tazas y Botellas",
    columns: [
      {
        title: "TAZAS PERSONALIZADAS",
        href: "/tazas-personalizadas",
        items: [
          { label: "Cerámica", href: "/tazas-personalizadas/tazas-ceramica" },
          { label: "Sublimación", href: "/tazas-personalizadas/tazas-sublimacion" },
          { label: "Metálicas", href: "/tazas-personalizadas/tazas-metalicas" },
        ],
      },
      {
        title: "BOTELLAS PERSONALIZADAS",
        href: "/botellas-personalizadas",
        items: [
          { label: "Aluminio", href: "/botellas-personalizadas/botellas-aluminio" },
          { label: "Térmicas / termos", href: "/botellas-personalizadas/termos" },
          { label: "Cristal", href: "/botellas-personalizadas/botellas-cristal" },
        ],
      },
    ],
  },

  "merchandising": {
    title: "Merchandising",
    columns: [
      {
        title: "TECNOLOGÍA",
        href: "/tecnologia-personalizada",
        items: [
          { label: "Power banks", href: "/tecnologia-personalizada/power-bank" },
          { label: "Altavoces", href: "/tecnologia-personalizada/altavoz" },
          { label: "Auriculares", href: "/tecnologia-personalizada/auriculares" },
          { label: "Memorias USB", href: "/tecnologia-personalizada/memoria-usb" },
        ],
      },
      {
        title: "ESCRITURA Y PAPELERÍA",
        href: "/escritura-personalizada",
        items: [
          { label: "Bolígrafos", href: "/boligrafos-personalizados" },
          { label: "Plástico", href: "/boligrafos-personalizados/boligrafos-plastico" },
          { label: "Metálicos", href: "/boligrafos-personalizados/boligrafos-metalicos" },
          { label: "Madera", href: "/boligrafos-personalizados/boligrafos-madera" },
          { label: "Ecológicos", href: "/boligrafos-personalizados/boligrafos-ecologicos" },
          { label: "Libretas", href: "/libretas-personalizadas" },
          { label: "Carpetas", href: "/carpetas-personalizadas" },
        ],
      },
      {
        title: "HOGAR Y DECORACIÓN",
        href: "/hogar-personalizado",
        items: [
          { label: "Cocina", href: "/hogar-personalizado/cocina" },
          { label: "Decoración", href: "/hogar-personalizado/decoracion" },
          { label: "Mantas", href: "/hogar-personalizado/mantas" },
          { label: "Velas", href: "/hogar-personalizado/velas" },
        ],
      },
      {
        title: "EVENTOS Y PROMOCIÓN",
        href: "/merchandising-eventos",
        items: [
          { label: "Imanes", href: "/imanes-personalizados" },
          { label: "Lanyards", href: "/lanyards-personalizados" },
          { label: "Llaveros", href: "/llaveros-personalizados" },
          { label: "Chapas", href: "/chapas-personalizadas" },
        ],
      },
      {
        title: "VERANO Y PLAYA",
        href: "/verano-personalizado",
        items: [
          { label: "Toallas", href: "/verano-personalizado/toalla-playa" },
          { label: "Sombrillas", href: "/verano-personalizado/sombrilla-playa" },
          { label: "Gafas de sol", href: "/verano-personalizado/gafas-sol" },
        ],
      },
      {
        title: "TEMPORADA",
        href: "/invierno-personalizado",
        items: [
          { label: "Invierno", href: "/invierno-personalizado" },
          { label: "Guantes", href: "/invierno-personalizado/guantes" },
          { label: "Térmicos", href: "/invierno-personalizado/termicos" },
          { label: "Paraguas", href: "/paraguas-personalizados" },
        ],
      },
      {
        title: "DEPORTES Y MASCOTAS",
        href: "/deporte-personalizado",
        items: [
          { label: "Deporte", href: "/deporte-personalizado" },
          { label: "Equipaciones", href: "/deporte-personalizado/equipaciones" },
          { label: "Accesorios", href: "/deporte-personalizado/accesorios" },
          { label: "Mascotas", href: "/mascotas-personalizadas" },
        ],
      },
    ],
  },

  "servicios": {
    title: "Servicios",
    columns: [
      {
        title: "SERIGRAFÍA",
        href: "/servicios/serigrafia",
        items: [{ label: "La serigrafía es una técnica de impresión...", href: "/servicios/serigrafia" }],
      },
      {
        title: "SUBLIMACIÓN",
        href: "/servicios/sublimacion",
        items: [{ label: "Ideal para ropa deportiva y técnica...", href: "/servicios/sublimacion" }],
      },
      {
        title: "BORDADO",
        href: "/servicios/bordado",
        items: [{ label: "Acabado premium y duradero...", href: "/servicios/bordado" }],
      },
      {
        title: "IMPRESIÓN DIGITAL",
        href: "/servicios/impresion-digital",
        items: [{ label: "Impresión a todo color sin límites...", href: "/servicios/impresion-digital" }],
      },
      {
        title: "DTF",
        href: "/servicios/impresion-dtf",
        items: [{ label: "Transferencia DTF de alta calidad...", href: "/servicios/impresion-dtf" }],
      },
    ],
  },
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
          {/* Contenedor visual del grupo principal */}
          <div
            className={`flex items-center gap-1 py-6 cursor-default ${
              activeMenu === key ? "text-blue-500" : ""
            }`}
          >
            {section.title} <span className="text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Dropdown Panel */}
          {activeMenu === key && (
            <div className="absolute top-full left-0 w-[90vw] max-w-7xl -translate-x-1/4 bg-white shadow-xl border-t-4 border-blue-400 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex p-8 gap-8">
                {/* Columns */}
                <div className={`flex-1 grid ${key === 'ropa-personalizada' ? 'grid-cols-6' : key === 'merchandising' ? 'grid-cols-7' : key === 'servicios' ? 'grid-cols-5' : 'grid-cols-4'} gap-8`}>
                  {section.columns.map((col, idx) => (
                    <div key={idx}>
                      {key !== "servicios" && (
                        <>
                          <Link
                            href={col.href}
                            className="block font-bold text-slate-900 mb-4 hover:text-blue-500 text-xs"
                          >
                            {col.title}
                          </Link>
                          {col.items && (
                            <ul className="space-y-2">
                              {col.items.map((item, i) => (
                                <li key={i}>
                                  <Link
                                    href={item.href}
                                    className="text-slate-500 hover:text-blue-500 text-[11px] capitalize font-normal block py-1"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                      {/* Special case for Services with images */}
                      {key === "servicios" ? (
                        <div className="mt-0">
                          <Link
                            href={col.href}
                            className="block mb-3 overflow-hidden rounded-md"
                          >
                            <img
                              src={`/images/services/${col.title
                                .toLowerCase()
                                .replace(" ", "-")
                                .replace("ó", "o")
                                .replace("í", "i")}.jpg`}
                              alt={col.title}
                              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://placehold.co/300x200?text=" + col.title;
                              }}
                            />
                          </Link>
                          <Link
                            href={col.href}
                            className="block font-bold text-slate-900 mb-2 hover:text-blue-500 text-sm"
                          >
                            {col.title}
                          </Link>
                          {col.items &&
                            col.items.map((item, i) => (
                              <p
                                key={i}
                                className="text-[11px] text-slate-500 normal-case font-normal leading-relaxed"
                              >
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
                    <img
                      src={section.image.src}
                      alt={section.image.alt}
                      className="w-full h-auto rounded shadow-sm"
                    />
                    <p className="mt-2 text-center text-blue-500 font-medium text-xs">
                      {section.image.alt}
                    </p>
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
