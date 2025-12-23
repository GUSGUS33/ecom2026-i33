import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Link } from "wouter";
import { DynamicProductBlock } from "@/components/DynamicProductBlock";
import { Helmet } from "react-helmet-async";
import { useExternalScripts } from "@/hooks/useExternalScripts";
import { useEffect, useState } from "react";

function HeroSlider() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/images/articulos-promocionales-personalizados-empresa.jpg",
    "/images/banner-img-10.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {images.map((src, index) => (
        <img 
          key={src}
          src={src}
          alt="Artículos promocionales personalizados"
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
      ))}
    </>
  );
}

export default function Home() {
  const scriptsLoaded = useExternalScripts();

  // Load Elfsight script dynamically
  useEffect(() => {
    if (scriptsLoaded) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.defer = true;
      script.dataset.useServiceCore = "";
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      }
    }
  }, [scriptsLoaded]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "IMPACTO33",
    "url": "https://impacto33.com",
    "logo": "https://impacto33.com/images/logo-impacto33.png",
    "description": "Artículos promocionales y regalos publicitarios personalizados para empresas.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ES"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+34690906027",
      "contactType": "customer service",
      "areaServed": "ES",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.facebook.com/impacto33",
      "https://www.instagram.com/impacto33",
      "https://twitter.com/impacto33"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IMPACTO33",
    "url": "https://impacto33.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://impacto33.com/buscar?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      {/* Hero Section - Refactored to match original site structure */}
      <div className="w-full bg-[#f5f5f5]">
        <div className="hero-banner relative overflow-hidden w-full">
          {/* Slider Images */}
          <HeroSlider />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none"></div>

          <div className="hero-banner-inside px-4 relative z-10">
            <div className="font-['Montserrat'] text-base md:text-xl uppercase tracking-widest mb-2">
              ¿Te ayudamos a buscar?
            </div>
            <div className="font-['Montserrat'] text-3xl md:text-6xl font-extrabold uppercase tracking-tight mb-6 md:mb-8 leading-tight">
              Tu producto personalizado
            </div>
            
            <div className="w-full max-w-2xl mx-auto">
              <form className="relative flex items-center w-full">
                <input 
                  type="text" 
                  name="search" 
                  placeholder="Buscar..." 
                  className="w-full h-[50px] md:h-[60px] px-6 rounded-full border-none outline-none text-slate-600 text-lg bg-white"
                />
                <button 
                  type="button" 
                  className="absolute right-1 top-1 bottom-1 w-[42px] md:w-[52px] h-[42px] md:h-[52px] bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <section className="bg-white py-8 md:py-10 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/images/price-tag.png" alt="Precios" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase">Precios mayoristas</h3>
                <p className="text-xs text-slate-500">Directos de fábrica</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/images/smartphone-ICON.png" alt="Atención" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase">Atención personalizada</h3>
                <p className="text-xs text-slate-500">Te asesoramos en todo</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/images/supermarket.png" alt="Talleres" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase">Talleres propios</h3>
                <p className="text-xs text-slate-500">Control de calidad total</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/images/delivery-truck (1).png" alt="Entrega" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase">Entrega rápida</h3>
                <p className="text-xs text-slate-500">En toda España</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Artículos promocionales y regalos publicitarios personalizados.</h2>
            <p className="text-slate-500 text-sm md:text-base">Descubre nuestro catálogo para empresas y particulares.</p>
          </div>

          {/* Mobile Slider / Desktop Grid */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 gap-6 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible snap-x snap-mandatory scrollbar-hide">
              {[
                { name: "Camisetas", img: "categoria-camisetas.webp", link: "/camisetas-personalizadas/", alt: "Camisetas personalizadas para empresas y eventos" },
                { name: "Sudaderas", img: "categoria-sudaderas.webp", link: "/sudaderas-personalizadas/", alt: "Sudaderas personalizadas con logo corporativo" },
                { name: "Polos", img: "categoria-polos.webp", link: "/polos-personalizados/", alt: "Polos bordados y serigrafiados para uniformes" },
                { name: "Chaquetas", img: "categoria-chaquetas.webp", link: "/chaquetas-personalizadas/", alt: "Chaquetas y ropa de abrigo personalizada" },
                { name: "Ropa deportiva", img: "categoria-camisetas-tecnicas.webp", link: "/ropa-deportiva-personalizadas/", alt: "Camisetas técnicas y equipaciones deportivas personalizadas" },
                { name: "Ropa laboral", img: "categoria-ropa-vestuario-laboral.webp", link: "/ropa-laboral-personalizadas/", alt: "Vestuario laboral y uniformes de trabajo personalizados" },
                
                { name: "Tazas", img: "categoria-tazas.webp", link: "/tazas-personalizadas/", alt: "Tazas personalizadas con foto o logo para publicidad" },
                { name: "Libretas", img: "categoria-libretas.webp", link: "/libretas-personalizadas/", alt: "Libretas y cuadernos corporativos personalizados" },
                { name: "Usb", img: "categoria-memorias-usb.webp", link: "/tecnologia-personalizada/memorias-usb/", alt: "Memorias USB y pendrives personalizados para regalo" },
                { name: "Bidones", img: "categoria-bidones-botellas.webp", link: "/tazas-personalizadas/botellas/", alt: "Botellas y bidones de agua personalizados con logo" },
                { name: "Bolsas de tela", img: "categoria-bolsas.webp", link: "/bolsas-personalizadas/", alt: "Bolsas de tela y tote bags personalizadas para ferias" },
                { name: "Llaveros", img: "categoria-llaveros.webp", link: "/merchandising-personalizado/llaveros/", alt: "Llaveros publicitarios personalizados baratos" },
                
                { name: "Chapas personalizadas", img: "categoria-chapas.webp", link: "/merchandising-personalizado/chapas/", alt: "Chapas personalizadas para eventos y campañas" },
                { name: "Imanes personalizados", img: "categoria-imanes.webp", link: "/merchandising-personalizado/imanes/", alt: "Imanes de nevera personalizados publicitarios" },
                { name: "Pegatinas", img: "categoria-pegatinas.webp", link: "/merchandising-personalizado/pegatinas/", alt: "Pegatinas y adhesivos personalizados en vinilo" },
                { name: "Lanyards personalizados", img: "categoria-lanyards.webp", link: "/merchandising-personalizado/lanyards/", alt: "Lanyards y cintas de acreditación personalizadas" },
                { name: "Gorras para personalizar", img: "categoria-gorras.webp", link: "/gorras-personalizadas/", alt: "Gorras bordadas y personalizadas para publicidad" },
                { name: "Artículos para Fiestas", img: "categoria-articulos-para-fiestas.webp", link: "/merchandising-personalizado/fiestas/", alt: "Artículos de fiesta y cotillón personalizados" },
              ].map((cat, idx) => (
                <Link key={idx} href={cat.link}>
                  <div className="flex flex-col items-center group cursor-pointer min-w-[140px] snap-center">
                    <div className="w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-white group-hover:border-blue-500 transition-all duration-300 bg-white">
                      <img 
                        src={`/images/${cat.img}`} 
                        alt={cat.alt || cat.name} 
                        loading="lazy"
                        width="128"
                        height="128"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <h3 className="font-bold text-slate-700 text-sm md:text-base text-center group-hover:text-blue-600 transition-colors px-2">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
            {/* Mobile Scroll Hint */}
            <div className="md:hidden text-center text-slate-400 text-xs mt-2 animate-pulse">
              Desliza para ver más &rarr;
            </div>
          </div>
        </div>
      </section>

      {/* Diferénciate Section */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-600 mb-4 md:mb-6 leading-tight">
                Diferénciate con <br/>
                <span className="text-blue-500">Regalos personalizados</span> <br/>
                únicos.
              </h2>
              <p className="text-slate-500 mb-6 md:mb-8 text-lg md:text-xl font-light">
                El mejor marketing para tu empresa.
              </p>
              <Link href="/presupuesto-rapido">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 py-6 text-sm font-semibold tracking-wide w-full md:w-auto uppercase">
                  <span>COMENZAR AHORA</span>
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 relative">
               <img 
                 src="/images/regalos-personalizados-originales-para-empresas.jpg" 
                 srcSet="/images/regalos-personalizados-originales-para-empresas-mobile.webp 480w, /images/regalos-personalizados-originales-para-empresas-tablet.webp 768w, /images/regalos-personalizados-originales-para-empresas-desktop.webp 1200w"
                 sizes="(max-width: 768px) 100vw, 50vw"
                 alt="Regalos únicos" 
                 className="w-full h-auto object-contain"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#48475c] mb-6 text-center">
          Opiniones de nuestros clientes
        </h2>
        {scriptsLoaded && <div className="elfsight-app-002cb98a-9032-4065-ae41-780f662588ea" />}
      </section>

      {/* Services Section - Hidden as requested */}
      <section className="py-16 bg-white hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Servicios de Impresión</h2>
            <p className="text-slate-500">Tecnología punta para resultados perfectos.</p>
          </div>
          
          {/* Using DynamicProductBlock to load real products from 'camisetas-personalizadas' category as 'Most Sold' example */}
          <DynamicProductBlock categorySlug="camisetas-personalizadas" limit={4} columns={4} />
          
          <div className="text-center mt-10">
            <Link href="/ropa-personalizada/camisetas">
              <Button asChild variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full px-8">
                <span>VER TODOS LOS PRODUCTOS</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section - Updated with user provided content */}
      <section className="py-16 bg-white hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Somos expertos en impresión de productos personalizados.</h2>
            <p className="text-slate-500">Utilizamos diferentes técnicas de personalización, que dependiendo del producto elegiremos la mejor opción.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "SERIGRAFÍA", desc: "La serigrafia es una técnica de impresión de imágenes de cualquier material, y consiste en transferir una tinta a través de una malla.", img: "servicio-estampar-ropa-serigrafia-textil.jpg", link: "/servicios/serigrafia" },
              { title: "SUBLIMACIÓN", desc: "Si quieres te agradecerá que te guste la ropa deportiva, te recomendamos que te asegures de que te guste más la ropa deportiva.", img: "servicio-personalizado-sublimacion-textil.jpg", link: "/servicios/sublimacion" },
              { title: "IMPRESIÓN DIGITAL TEXTIL", desc: "¿Necesitas un trabajo de impresión a todo color personalizado que se complete en muy poco tiempo? Entonces, la impresión directa a la prenda (DTG).", img: "servicio-DTG-impresion-digital-textil.jpg", link: "/servicios/impresion-digital" },
              { title: "VINILO TEXTIL", desc: "El vinilo textil es una lámina plástica termoadhesiva de colores lisos, que se utiliza para estampar tejidos.", img: "servicio-imprimir-vinilo-textil-personalizado.jpg", link: "/servicios/vinilo" },
              { title: "BORDADOS", desc: "El bordado es un arte que consiste en la ornamentación por medio de hebras textiles, de una superficie flexible, generalmente una tela.", img: "servicio-bordados.jpg", link: "/servicios/bordado" },
              { title: "TRANSFER TEXTIL", desc: "La estampación por medio de Transfers Textiles es la forma más rápida, limpia y versátil de decorar cualquier prenda o material textil.", img: "servicio-DTF-transfer-textil.jpg", link: "/servicios/transfer" },
            ].map((srv, idx) => (
              <Link key={idx} href={srv.link}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer h-full border border-slate-100">
                  <div className="h-auto overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                      src={`/images/${srv.img}`} 
                      alt={srv.title} 
                      loading="lazy"
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-blue-600 uppercase tracking-wide">{srv.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{srv.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-[#f8f9fa] border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-12 mt-5">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">Grandes marcas <span className="text-blue-500">que confían</span> en nosotros.</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center pt-2">
              <div className="mb-5 text-center"><img className="img-fluid max-h-12 md:max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" src="/images/brands/logo-dir.png" alt="dir" /></div>
              <div className="mb-5 text-center"><img className="img-fluid max-h-12 md:max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" src="/images/brands/logo-santiveri.png" alt="santiveri" /></div>
              <div className="mb-5 text-center"><img className="img-fluid max-h-12 md:max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" src="/images/brands/logo-airdna.png" alt="airdna" /></div>
              <div className="mb-5 text-center"><img className="img-fluid max-h-12 md:max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" src="/images/brands/logo-inditex.png" alt="inditex" /></div>
              <div className="hidden md:block mb-5 text-center"><img className="img-fluid max-h-12 md:max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" src="/images/brands/logo-yoigo.png" alt="yoigo" /></div>
              <div className="hidden md:block mb-5 text-center"><img className="img-fluid max-h-12 md:max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" src="/images/brands/logo-mango.png" alt="mango" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">¿Por qué elegir IMPACTO33?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Calidad Garantizada</h3>
              <p className="text-slate-600 text-sm">Revisamos cada pedido manualmente para asegurar el mejor resultado.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Experiencia</h3>
              <p className="text-slate-600 text-sm">Más de 10 años personalizando productos para grandes empresas.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-xl">
                %
              </div>
              <h3 className="font-bold text-lg mb-2">Mejor Precio</h3>
              <p className="text-slate-600 text-sm">Precios competitivos y descuentos por volumen para mayoristas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
