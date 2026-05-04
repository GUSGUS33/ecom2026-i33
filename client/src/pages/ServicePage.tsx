import React from 'react';
import { useRoute, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Image as ImageIcon, Printer, Palette, Layers, HelpCircle, ChevronDown, XCircle, Clock, Target, Droplet, Shield, Zap, Recycle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// ============================================================================
// DATOS DE LOS SERVICIOS - CONTENIDO EXACTO DE ESTRUCTURA HÍBRIDA
// ============================================================================

const servicesData: Record<string, {
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  introText: string;
  image: string;
  icon: React.ElementType;
  gallery: string[];
  
  // SECCIÓN 2: QUÉ ES Y CUÁNDO USAR
  whatIsTitle: string;
  whatIsContent: string;
  whenToUseTitle: string;
  whenToUse: { text: string }[];
  whenNotToUseTitle: string;
  whenNotToUse: { text: string; alternative: string }[];
  
  // SECCIÓN 3: PROCESO Y VENTAJAS
  processTitle: string;
  process: { number: number; title: string; description: string; duration: string }[];
  advantagesTitle: string;
  advantages: { icon: React.ElementType; title: string; description: string }[];
  
  // SECCIÓN 4: NUESTRO SERVICIO
  ourServiceTitle: string;
  ourServiceContent: string;
  serviceIncludesTitle: string;
  serviceIncludes: string[];
  deliveryTimesTitle: string;
  deliveryTimes: { quantity: string; time: string }[];
  
  // SECCIÓN 5: CTA + FORMULARIO
  ctaFormTitle: string;
  ctaFormText: string;
  
  // SECCIÓN 6: CASOS DE USO
  useCasesTitle: string;
  useCases: { icon: React.ElementType; title: string; description: string; cta: string }[];
  portfolioTitle: string;
  
  // SECCIÓN 7: FAQ
  faqTitle: string;
  faqs: { question: string; answer: string }[];
  
  // SECCIÓN 8: COMPARATIVA
  comparativeTitle: string;
  comparativeTable: {
    headers: string[];
    rows: any[]; // Flexible para diferentes estructuras de columnas
  };
  
  // SECCIÓN 9: CTA FINAL
  finalCtaTitle: string;
  finalCtaText: string;
}> = {
  "serigrafia": {
    // ========================================================================
    // META-DATOS SEO (Del documento original)
    // ========================================================================
    metaTitle: "Serigrafía Textil para Grandes Cantidades | IMPACTO33",
    metaDescription: "Serigrafía textil profesional en España para pedidos desde 500 unidades. Ideal para empresas que buscan personalización de calidad a gran escala. Pide presupuesto.",
    h1: "Serigrafía Textil: Calidad profesional para grandes cantidades",
    
    // ========================================================================
    // SECCIÓN 1: HERO (Contenido exacto del documento)
    // ========================================================================
    title: "Serigrafía Textil",
    description: "La técnica de estampación más duradera y rentable para pedidos grandes",
    
    introText: "La serigrafía textil es la técnica de estampación más duradera y rentable para pedidos grandes. En IMPACTO33 somos especialistas en serigrafía para empresas, eventos y organizaciones que necesitan desde 500 unidades con un acabado profesional que resiste más de 100 lavados. Ideal para camisetas, sudaderas y textil promocional cuando buscas máxima calidad y precio competitivo en grandes volúmenes.",
    
    image: "/images/servicio-estampar-ropa-serigrafia-textil.jpg",
    icon: Layers,
    
    // ========================================================================
    // SECCIÓN 2: QUÉ ES Y CUÁNDO USAR (Contenido exacto)
    // ========================================================================
    whatIsTitle: "¿Qué es la serigrafía textil y cómo funciona?",
    whatIsContent: "La serigrafía es una técnica de estampación que utiliza pantallas de malla para transferir tinta directamente sobre el tejido. Cada color del diseño requiere una pantalla independiente, lo que hace que el setup inicial tenga un coste fijo. Sin embargo, una vez preparadas las pantallas, el coste por unidad se reduce drásticamente, convirtiéndola en la opción más económica para producciones grandes.\n\nEl proceso consiste en preparar una pantalla por cada color, aplicar la tinta mediante presión y curarla con calor para fijar el estampado permanentemente en el tejido. El resultado es una impresión duradera, con colores vivos y gran resistencia al lavado y al uso intensivo.",
    
    whenToUseTitle: "¿Cuándo es mejor usar serigrafía?",
    whenToUse: [
      { text: "Pedidos grandes: Desde 500-1,000 unidades" },
      { text: "Diseños simples: Máximo 2-3 colores" },
      { text: "Colores sólidos: Sin degradados ni fotografías" },
      { text: "Máxima durabilidad: Más de 100 lavados garantizados" },
      { text: "Presupuesto competitivo: Menor coste por unidad en grandes cantidades" },
      { text: "Uso intensivo: Uniformes de trabajo, ropa deportiva, merchandising masivo" }
    ],
    
    whenNotToUseTitle: "¿Cuándo NO recomendamos serigrafía?",
    whenNotToUse: [
      { 
        text: "Pedidos pequeños (<500 uds)", 
        alternative: "Para cantidades menores, recomendamos DTF textil que no requiere setup." 
      },
      { 
        text: "Diseños multicolor (4+ colores)", 
        alternative: "Los diseños complejos incrementan costes. En estos casos, DTF es más eficiente." 
      },
      { 
        text: "Fotografías o degradados", 
        alternative: "La serigrafía funciona con colores planos. Para imágenes fotográficas, mejor impresión digital DTG." 
      },
      { 
        text: "Tejidos 100% poliéster", 
        alternative: "Para prendas técnicas de poliéster, recomendamos sublimación." 
      }
    ],
    
    // ========================================================================
    // SECCIÓN 3: PROCESO Y VENTAJAS (Contenido exacto)
    // ========================================================================
    processTitle: "Nuestro proceso de serigrafía paso a paso",
    process: [
      {
        number: 1,
        title: "Preparación del diseño",
        description: "Vectorizamos tu logo si es necesario. Separamos colores (máx. 2-3 para optimizar coste). Te enviamos boceto digital para aprobación.",
        duration: "1-2 días"
      },
      {
        number: 2,
        title: "Creación de pantallas",
        description: "Fabricamos pantallas específicas para tu diseño. Preparamos setup de tintas Pantone si lo requieres. Las pantallas se guardan para futuros pedidos.",
        duration: "2-3 días"
      },
      {
        number: 3,
        title: "Estampación",
        description: "Aplicación de tinta capa por capa. Control de calidad durante todo el proceso. Secado y curado profesional en horno.",
        duration: "3-7 días según cantidad"
      },
      {
        number: 4,
        title: "Entrega",
        description: "Empaquetado por tallas si lo solicitas. Envío a toda España. Posibilidad de recogida en nuestras instalaciones.",
        duration: "Según ubicación"
      }
    ],
    
    advantagesTitle: "Ventajas de la serigrafía profesional",
    advantages: [
      {
        icon: Palette,
        title: "Colores vibrantes",
        description: "Tintas especiales que mantienen intensidad tras múltiples lavados."
      },
      {
        icon: Shield,
        title: "Máxima durabilidad",
        description: "Resiste más de 100 lavados sin agrietarse ni desprenderse."
      },
      {
        icon: Target,
        title: "Coste-efectividad",
        description: "A partir de 500 uds, el precio por unidad es imbatible."
      },
      {
        icon: Layers,
        title: "Producción escalable",
        description: "Podemos producir miles de unidades con calidad consistente."
      },
      {
        icon: Recycle,
        title: "Tintas ecológicas",
        description: "Trabajamos con tintas al agua certificadas Oeko-Tex."
      },
      {
        icon: Droplet,
        title: "Tacto suave",
        description: "Curado profesional que mantiene transpirabilidad del tejido."
      }
    ],
    
    // ========================================================================
    // SECCIÓN 4: NUESTRO SERVICIO (Contenido exacto)
    // ========================================================================
    ourServiceTitle: "Serigrafía textil en IMPACTO33",
    ourServiceContent: "Con más de [X años] de experiencia en estampación textil, en IMPACTO33 hemos perfeccionado el proceso de serigrafía para garantizar resultados profesionales en cada pedido. Trabajamos con las mejores tintas del mercado, maquinaria de última generación y un equipo especializado que controla cada fase del proceso.\n\nNuestro enfoque es simple: asesorarte honestamente sobre la mejor técnica para tu proyecto. Si la serigrafía no es la opción más adecuada para tu cantidad o diseño, te lo diremos y te recomendaremos DTF o impresión digital. Nos importa más tu satisfacción que hacer un pedido que no va a cumplir tus expectativas.",
    
    serviceIncludesTitle: "¿Qué incluye nuestro servicio?",
    serviceIncludes: [
      "Asesoramiento técnico sin compromiso",
      "Vectorización de logo (si es necesario)",
      "Prueba de color antes de producción (pedidos +1000 uds)",
      "Separación de colores optimizada",
      "Control de calidad unidad por unidad",
      "Guardado de pantallas para futuros pedidos",
      "Empaquetado profesional por tallas",
      "Envío asegurado a toda España"
    ],
    
    deliveryTimesTitle: "Plazos de entrega",
    deliveryTimes: [
      { quantity: "500-1,000 uds", time: "10-12 días laborables" },
      { quantity: "1,000-2,500 uds", time: "12-15 días laborables" },
      { quantity: "+2,500 uds", time: "15-20 días laborables" }
    ],
    
    // ========================================================================
    // SECCIÓN 5: CTA PRINCIPAL + FORMULARIO (Contenido exacto)
    // ========================================================================
    ctaFormTitle: "Solicita presupuesto de serigrafía sin compromiso",
    ctaFormText: "Cada proyecto es único. Cuéntanos qué necesitas y te asesoraremos sobre la mejor forma de llevar tu diseño al textil. Si la serigrafía no es la opción óptima para tu cantidad o diseño, te lo diremos y te propondremos alternativas. Nuestro objetivo es que estés 100% satisfecho con el resultado.",
    
    // ========================================================================
    // SECCIÓN 6: CASOS DE USO + PORTFOLIO (Contenido exacto)
    // ========================================================================
    useCasesTitle: "Casos de uso habituales de serigrafía",
    useCases: [
      {
        icon: CheckCircle2,
        title: "Uniformes corporativos",
        description: "Empresas con equipos grandes que necesitan mantener identidad visual. Ideal para promociones internas de 500+ empleados.",
        cta: "Ver uniformes corporativos"
      },
      {
        icon: CheckCircle2,
        title: "Eventos y festivales",
        description: "Merchandising oficial de festivales, congresos y eventos masivos. Durabilidad garantizada para múltiples usos.",
        cta: "Ver merchandising eventos"
      },
      {
        icon: CheckCircle2,
        title: "Equipaciones deportivas",
        description: "Clubs deportivos, ligas escolares y equipos amateur. Resiste lavados frecuentes y uso intensivo.",
        cta: "Ver ropa deportiva"
      }
    ],
    
    portfolioTitle: "Trabajos realizados con serigrafía",
    gallery: [
      "/images/categories/camisetas.webp",
      "/images/categories/sudaderas.webp",
      "/images/categories/bolsas.webp",
      "/images/categories/polos.webp",
      "/images/categories/delantales.webp",
      "/images/categories/equipaciones-deportivas.webp"
    ],
    
    // ========================================================================
    // SECCIÓN 7: FAQ (Contenido exacto - 8 preguntas)
    // ========================================================================
    faqTitle: "Preguntas frecuentes sobre serigrafía",
    faqs: [
      { 
        question: "¿Cuál es el pedido mínimo para serigrafía?", 
        answer: "En IMPACTO33 recomendamos serigrafía a partir de 500-1,000 unidades para que sea rentable. Para cantidades menores, te sugerimos impresión DTF que no tiene costes de setup y resulta más económica en pedidos pequeños."
      },
      { 
        question: "¿Puedo hacer un diseño con 5 colores?", 
        answer: "Técnicamente sí, pero el coste se incrementa significativamente con cada color adicional (cada color requiere una pantalla). Para diseños de 4+ colores, DTF textil suele ser más eficiente en coste y tiempo de producción."
      },
      { 
        question: "¿Cuánto dura una serigrafía?", 
        answer: "Una serigrafía bien aplicada resiste más de 100 lavados sin perder calidad. Es la técnica más duradera del mercado. Las tintas se integran en el tejido, no se pegan sobre él, por lo que no se agrietan ni desprenden."
      },
      { 
        question: "¿Se nota mucho al tacto?", 
        answer: "Con nuestro proceso de curado profesional, el tacto es suave y transpirable. Las tintas al agua penetran en el tejido en lugar de crear una capa gruesa como los vinilos."
      },
      { 
        question: "¿Guardáis las pantallas para futuros pedidos?", 
        answer: "Sí, guardamos tus pantallas durante [X meses/años]. Esto significa que en pedidos sucesivos no pagas el setup inicial, solo la estampación."
      },
      { 
        question: "¿Puedo hacer una prueba antes del pedido completo?", 
        answer: "Para pedidos superiores a 1,000 unidades, incluimos una prueba de color sin coste adicional. Para cantidades menores, podemos hacer una muestra con coste de setup que se descuenta del pedido final."
      },
      { 
        question: "¿Qué pasa si mi diseño no está en vectorial?", 
        answer: "No hay problema. Nuestro equipo de diseño puede vectorizar tu logo sin coste adicional en la mayoría de casos. Solo necesitamos una imagen en buena resolución (PNG o JPG de alta calidad)."
      },
      { 
        question: "¿Trabajáis con tintas Pantone específicas?", 
        answer: "Sí, podemos trabajar con colores Pantone exactos si es crítico para tu marca. Ten en cuenta que puede haber ligeras variaciones según el tipo de tejido (algodón vs mezcla vs sintético)."
      }
    ],
    
    // ========================================================================
    // SECCIÓN 8: COMPARATIVA TÉCNICAS (Contenido exacto)
    // ========================================================================
    comparativeTitle: "Serigrafía vs otras técnicas: ¿Cuál elegir?",
    comparativeTable: {
      headers: ["Criterio", "Serigrafía", "DTF", "Impresión Digital"],
      rows: [
        { label: "Cantidad mínima", serigrafia: "500-1,000 uds", dtf: "1-50 uds", digital: "1-100 uds" },
        { label: "Colores", serigrafia: "1-3 ideal", dtf: "Ilimitados", digital: "Ilimitados" },
        { label: "Coste unitario", serigrafia: "€€ (bajo en grandes series)", dtf: "€€€", digital: "€€€€" },
        { label: "Setup inicial", serigrafia: "Sí (€€€)", dtf: "No", digital: "No" },
        { label: "Durabilidad", serigrafia: "⭐⭐⭐⭐⭐", dtf: "⭐⭐⭐⭐", digital: "⭐⭐⭐" },
        { label: "Tipos de diseño", serigrafia: "Logos, textos, formas simples", dtf: "Todo tipo", digital: "Fotografías, degradados" },
        { label: "Plazo", serigrafia: "10-15 días", dtf: "7-10 días", digital: "5-7 días" },
        { label: "Tejidos", serigrafia: "Algodón, mezclas", dtf: "Todos", digital: "Algodón principalmente" }
      ]
    },
    
    // ========================================================================
    // SECCIÓN 9: CTA FINAL (Contenido exacto)
    // ========================================================================
    finalCtaTitle: "¿Listo para tu proyecto de serigrafía?",
    finalCtaText: "Ya sea que necesites 500 camisetas para tu empresa, 2,000 sudaderas para un evento o 5,000 polos para una campaña, estamos aquí para ayudarte. Nuestro equipo revisará tu proyecto y te dirá honestamente si la serigrafía es tu mejor opción o si deberías considerar otra técnica."
  },

  // ========================================================================
  // SERVICIO 2: BORDADO TEXTIL
  // ========================================================================
  "bordado": {
    // META-DATOS SEO
    metaTitle: "Bordado Textil Profesional | Calidad Premium IMPACTO33",
    metaDescription: "Bordado textil profesional en España. Acabado premium y elegante para uniformes corporativos, gorras y prendas de alta gama. Máxima durabilidad. Pide presupuesto.",
    h1: "Bordado Textil: El acabado premium por excelencia",
    
    // SECCIÓN 1: HERO
    title: "Bordado Textil",
    description: "Elegancia y distinción. El acabado premium que eleva tu marca",
    
    introText: "El bordado textil es la técnica de personalización más elegante, duradera y resistente del mercado. En IMPACTO33 bordamos con hilos de alta calidad directamente sobre la prenda, creando un relieve único que aporta distinción y profesionalidad. Ideal para uniformes corporativos, polos, gorras y prendas de alta gama que buscan transmitir seriedad y calidad premium. Un bordado bien ejecutado dura prácticamente toda la vida de la prenda.",
    
    image: "/images/servicio-bordados.jpg",
    icon: Layers,
    
    // SECCIÓN 2: QUÉ ES Y CUÁNDO USAR
    whatIsTitle: "¿Qué es el bordado textil y cómo funciona?",
    whatIsContent: "El bordado es una técnica milenaria que consiste en coser hilos de colores directamente sobre el tejido mediante máquinas bordadoras computarizadas de alta precisión. A diferencia de la serigrafía o la impresión digital que aplican tinta, el bordado crea un relieve tridimensional con hilos resistentes que se integran permanentemente en la tela.\n\nEl proceso comienza con la digitalización del diseño (llamado 'picaje'), donde se convierte tu logo en un archivo que la máquina bordadora puede interpretar. Cada puntada se programa con precisión para crear el diseño exacto. Los hilos de poliéster o rayón de alta calidad garantizan colores brillantes y resistencia excepcional. El resultado es un acabado profesional con textura y relieve que ninguna otra técnica puede igualar.",
    
    whenToUseTitle: "¿Cuándo es mejor usar bordado?",
    whenToUse: [
      { text: "Uniformes corporativos: Imagen profesional y elegante" },
      { text: "Polos y camisas: Acabado premium en pecho o manga" },
      { text: "Gorras y sombreros: La técnica estándar para este tipo de prendas" },
      { text: "Chaquetas y abrigos: Resiste lavados industriales y uso intensivo" },
      { text: "Máxima durabilidad: Prácticamente eterno, no se borra ni desvanece" },
      { text: "Percepción de calidad: Eleva el valor percibido de tu marca" }
    ],
    
    whenNotToUseTitle: "¿Cuándo NO recomendamos bordado?",
    whenNotToUse: [
      { 
        text: "Diseños fotográficos o degradados", 
        alternative: "El bordado solo puede reproducir colores sólidos. Para fotografías o degradados, recomendamos impresión digital DTG o sublimación." 
      },
      { 
        text: "Textos muy pequeños (<5mm altura)", 
        alternative: "Letras diminutas no se pueden bordar con claridad. Para textos pequeños, mejor serigrafía o DTF." 
      },
      { 
        text: "Camisetas finas (<160g)", 
        alternative: "El peso del bordado puede arrugar tejidos muy ligeros. Para camisetas finas, recomendamos serigrafía o DTF." 
      },
      { 
        text: "Diseños muy complejos con muchos detalles", 
        alternative: "Diseños con líneas muy finas o detalles intrincados pueden perder definición. Simplificamos el diseño o sugerimos impresión digital." 
      }
    ],
    
    // SECCIÓN 3: PROCESO Y VENTAJAS
    processTitle: "Nuestro proceso de bordado paso a paso",
    process: [
      {
        number: 1,
        title: "Digitalización (Picaje)",
        description: "Convertimos tu logo en un archivo digitalizado que la máquina bordadora puede interpretar. Optimizamos cada puntada para máxima calidad. Este archivo se guarda para futuros pedidos.",
        duration: "1-2 días"
      },
      {
        number: 2,
        title: "Selección de hilos",
        description: "Elegimos los colores exactos de hilo (Pantone disponible). Usamos hilos de poliéster de alta resistencia o rayón para mayor brillo según tus preferencias.",
        duration: "Incluido en picaje"
      },
      {
        number: 3,
        title: "Bordado y control de calidad",
        description: "Bordamos cada prenda con máquinas de última generación. Control de calidad exhaustivo en cada pieza. Revisión de tensión, densidad y acabado.",
        duration: "2-5 días según cantidad"
      },
      {
        number: 4,
        title: "Acabado y entrega",
        description: "Retiramos estabilizadores y revisamos cada bordado. Empaquetado profesional y envío a toda España. Recogida disponible en nuestras instalaciones.",
        duration: "Según ubicación"
      }
    ],
    
    advantagesTitle: "Ventajas del bordado profesional",
    advantages: [
      {
        icon: Shield,
        title: "Durabilidad superior",
        description: "Resiste lavados industriales a alta temperatura y desgaste diario mejor que cualquier tinta."
      },
      {
        icon: Target,
        title: "Imagen profesional",
        description: "Transmite seriedad y calidad, elevando la percepción de valor de tu marca o empresa."
      },
      {
        icon: Layers,
        title: "Relieve tridimensional",
        description: "El relieve de los hilos crea un efecto visual y táctil único que destaca sobre la prenda."
      },
      {
        icon: Zap,
        title: "Colores permanentes",
        description: "Los hilos mantienen su color y brillo indefinidamente, sin decoloración por sol o lavados."
      },
      {
        icon: CheckCircle2,
        title: "Versatilidad de tejidos",
        description: "Se puede bordar sobre algodón, poliéster, nylon, lana y mezclas. Incluso sobre cuero y tejidos técnicos."
      },
      {
        icon: CheckCircle2,
        title: "Acabados especiales",
        description: "Bordado 3D (con foam), apliques, lentejuelas, hilos metalizados y efectos únicos."
      }
    ],
    
    // SECCIÓN 4: NUESTRO SERVICIO
    ourServiceTitle: "Bordado textil en IMPACTO33",
    ourServiceContent: "Con más de 15 años de experiencia en bordado profesional, en IMPACTO33 contamos con maquinaria bordadora de última generación y un equipo especializado en digitalización y control de calidad. Trabajamos con hilos de las mejores marcas del mercado (Madeira, Isacord) para garantizar colores brillantes y máxima resistencia.\n\nNuestro compromiso es la honestidad: si tu logo tiene detalles que no se pueden reproducir fielmente con bordado, te lo diremos y adaptaremos el diseño o te sugeriremos otra técnica. Preferimos tu satisfacción a corto plazo que un cliente insatisfecho a largo plazo. El bordado es una inversión en calidad, y queremos que estés orgulloso del resultado.",
    
    serviceIncludesTitle: "¿Qué incluye nuestro servicio?",
    serviceIncludes: [
      "Asesoramiento técnico profesional sin compromiso",
      "Digitalización (picaje) del diseño",
      "Adaptación del logo si es necesario para bordado",
      "Muestra de bordado antes de producción (pedidos +100 uds)",
      "Hilos de alta calidad (poliéster o rayón)",
      "Control de calidad pieza por pieza",
      "Guardado de archivo digital para futuros pedidos",
      "Empaquetado profesional",
      "Envío asegurado a toda España"
    ],
    
    deliveryTimesTitle: "Plazos de entrega",
    deliveryTimes: [
      { quantity: "1-50 uds", time: "5-7 días laborables" },
      { quantity: "50-200 uds", time: "7-10 días laborables" },
      { quantity: "+200 uds", time: "10-15 días laborables" }
    ],
    
    // SECCIÓN 5: CTA PRINCIPAL + FORMULARIO
    ctaFormTitle: "Solicita presupuesto de bordado sin compromiso",
    ctaFormText: "El bordado es una inversión en calidad y durabilidad. Cuéntanos qué necesitas y te asesoraremos sobre la mejor forma de bordar tu diseño. Si tu logo tiene elementos que no se pueden reproducir fielmente con hilos, te lo diremos honestamente y te propondremos adaptaciones o técnicas alternativas. Tu satisfacción es nuestra prioridad.",
    
    // SECCIÓN 6: CASOS DE USO + PORTFOLIO
    useCasesTitle: "Casos de uso habituales de bordado",
    useCases: [
      {
        icon: CheckCircle2,
        title: "Uniformes corporativos",
        description: "Empresas que buscan transmitir profesionalidad y calidad. Ideal para hoteles, restaurantes, clínicas, oficinas y cualquier sector donde la imagen corporativa es crítica.",
        cta: "Ver uniformes corporativos"
      },
      {
        icon: CheckCircle2,
        title: "Gorras y complementos",
        description: "El bordado es el estándar en gorras, viseras y sombreros. Relieve elegante que resiste el uso diario y múltiples lavados.",
        cta: "Ver gorras bordadas"
      },
      {
        icon: CheckCircle2,
        title: "Ropa laboral premium",
        description: "Chaquetas, polos y abrigos para sectores que requieren durabilidad extrema: seguridad, industria, construcción, sanidad.",
        cta: "Ver ropa laboral"
      }
    ],
    
    portfolioTitle: "Trabajos realizados con bordado",
    gallery: [
      "/images/categories/polos.webp",
      "/images/categories/gorras.webp",
      "/images/categories/chaquetas.webp",
      "/images/categories/camisas.webp",
      "/images/categories/sudaderas.webp",
      "/images/categories/uniformes-corporativos.webp"
    ],
    
    // SECCIÓN 7: FAQ
    faqTitle: "Preguntas frecuentes sobre bordado",
    faqs: [
      { 
        question: "¿Se puede bordar cualquier diseño?", 
        answer: "Casi todos, pero los textos muy pequeños (menos de 5mm de altura) o diseños con degradados no se pueden reproducir con hilo. Nuestro equipo adaptará tu logo para que quede perfecto en bordado, manteniendo la esencia de tu marca."
      },
      { 
        question: "¿Tiene coste el picaje (digitalización)?", 
        answer: "Sí, el picaje es la conversión de tu logo a formato bordable. Es un coste único que se cobra la primera vez. Si repites pedido, no se vuelve a cobrar ya que guardamos tu archivo digitalizado."
      },
      { 
        question: "¿Se puede bordar sobre camisetas finas?", 
        answer: "No lo recomendamos. El bordado tiene peso y puede arrugar o incluso rasgar tejidos muy finos (menos de 160g/m²). Es mejor usarlo en polos (180-220g), sudaderas, chaquetas o gorras con estructura."
      },
      { 
        question: "¿Cuántos colores de hilo puedo usar?", 
        answer: "Nuestras máquinas permiten hasta 12-15 colores por diseño, suficiente para la inmensa mayoría de logotipos corporativos. Sin embargo, recomendamos diseños de 3-6 colores para mejor resultado visual."
      },
      { 
        question: "¿El bordado se deteriora con los lavados?", 
        answer: "No, es prácticamente eterno. A diferencia de las tintas, los hilos no se decoloran, agrietan ni desprenden. Aguanta lavados industriales a 60-90ºC sin problemas. Es la técnica más duradera del mercado."
      },
      { 
        question: "¿Puedo bordar sobre gorras?", 
        answer: "Sí, el bordado es la técnica estándar para gorras y la más recomendada. Nuestras máquinas especializadas pueden bordar en frontal, lateral y trasero de gorras, viseras y sombreros."
      },
      { 
        question: "¿Qué diferencia hay entre hilo de poliéster y rayón?", 
        answer: "El poliéster es más resistente y duradero, ideal para ropa laboral y de uso intensivo. El rayón tiene más brillo y es perfecto para uniformes corporativos elegantes. Te asesoraremos según tu necesidad."
      },
      { 
        question: "¿Puedo hacer bordado 3D (con relieve)?", 
        answer: "Sí, ofrecemos bordado 3D utilizando foam (espuma) bajo los hilos para crear un relieve pronunciado. Es perfecto para gorras y diseños que quieres que destaquen visualmente."
      }
    ],
    
    // SECCIÓN 8: COMPARATIVA TÉCNICAS
    comparativeTitle: "Bordado vs otras técnicas: ¿Cuál elegir?",
    comparativeTable: {
      headers: ["Criterio", "Bordado", "Serigrafía", "DTF"],
      rows: [
        { label: "Cantidad mínima", bordado: "1-50 uds", serigrafia: "500-1,000 uds", dtf: "1-50 uds" },
        { label: "Durabilidad", bordado: "⭐⭐⭐⭐⭐ (eterna)", serigrafia: "⭐⭐⭐⭐⭐", dtf: "⭐⭐⭐⭐" },
        { label: "Percepción calidad", bordado: "Premium +++", serigrafia: "Profesional", dtf: "Estándar" },
        { label: "Coste unitario", bordado: "€€€€", serigrafia: "€€", dtf: "€€€" },
        { label: "Setup inicial", bordado: "Sí (picaje €€)", serigrafia: "Sí (pantallas €€€)", dtf: "No" },
        { label: "Tipos de diseño", bordado: "Logos simples, textos", serigrafia: "Logos, textos, formas", dtf: "Todo tipo" },
        { label: "Plazo", bordado: "5-10 días", serigrafia: "10-15 días", dtf: "7-10 días" },
        { label: "Ideal para", bordado: "Polos, gorras, uniformes", serigrafia: "Camisetas grandes cantidades", dtf: "Camisetas pequeñas cantidades" },
        { label: "Efecto visual", bordado: "Relieve 3D", serigrafia: "Plano", dtf: "Plano" }
      ]
    },
    
    // SECCIÓN 9: CTA FINAL
    finalCtaTitle: "¿Listo para elevar tu marca con bordado?",
    finalCtaText: "Ya sea que necesites 10 polos para tu equipo directivo, 100 gorras para un evento corporativo o 500 chaquetas para tus empleados, estamos aquí para asesorarte. Nuestro equipo revisará tu diseño y te dirá honestamente si el bordado es la mejor opción o si deberías considerar otra técnica. La calidad y tu satisfacción son nuestra prioridad."
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL - ServicePage
// ============================================================================

const ServicePage = () => {
  const [match, params] = useRoute("/servicios/:slug");
  const slug = params?.slug;
  const service = slug ? servicesData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Servicio no encontrado</h1>
        <p className="text-slate-600 mb-8">Lo sentimos, el servicio que buscas no existe o no está disponible.</p>
        <Link href="/">
          <Button className="bg-blue-600 text-white rounded-full px-8">Volver al Inicio</Button>
        </Link>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <>
      {/* ====================================================================
          META-DATOS Y SCHEMA MARKUP
          ==================================================================== */}
      <Helmet>
        <title>{service.metaTitle}</title>
        <meta name="description" content={service.metaDescription} />
        
        {/* Schema Markup: Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": service.title,
            "provider": {
              "@type": "Organization",
              "name": "IMPACTO33",
              "url": "https://impacto33.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ES"
              }
            },
            "areaServed": {
              "@type": "Country",
              "name": "España"
            },
            "description": service.metaDescription
          })}
        </script>

        {/* Schema Markup: FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": service.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>

        {/* Schema Markup: BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://impacto33.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Servicios",
                "item": "https://impacto33.com/#servicios"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": service.title,
                "item": `https://impacto33.com/servicios/${slug}`
              }
            ]
          })}
        </script>
      </Helmet>

      {/* ====================================================================
          BREADCRUMBS
          ==================================================================== */}
      <div className="bg-slate-900 pt-4 pb-0">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm inline-block rounded-lg px-4">
            <Breadcrumbs 
              items={[
                { label: "Servicios", href: "/#servicios" },
                { label: service.title }
              ]} 
            />
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECCIÓN 1: HERO (Above the fold - 20%)
          ==================================================================== */}
      <div className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={service.image} 
            alt={service.h1} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
              <Icon size={16} />
              Servicio Profesional
            </div>
            <h1 className="text-3xl md:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
              {service.h1}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8 leading-relaxed max-w-2xl">
              {service.introText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/presupuesto-rapido">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full font-bold shadow-lg shadow-blue-900/20 w-full sm:w-auto">
                  Solicitar Presupuesto
                </Button>
              </Link>
              <Link href="#trabajos">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full font-bold w-full sm:w-auto">
                  Ver trabajos realizados
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECCIÓN 2: QUÉ ES Y CUÁNDO USAR (25% - Educación)
          ==================================================================== */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* ¿Qué es la serigrafía? */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {service.whatIsTitle}
            </h2>
            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
              {service.whatIsContent.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
            {/* NUEVO/CREAR: Imagen/diagrama del proceso de serigrafía (4 pasos visuales) */}
            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 italic text-center">
                [NUEVO/CREAR: Diagrama visual del proceso de serigrafía - 4 pasos ilustrados]
              </p>
            </div>
          </div>

          {/* ¿Cuándo SÍ usar serigrafía? */}
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
              {service.whenToUseTitle}
            </h3>
            <ul className="space-y-4">
              {service.whenToUse.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="mt-1 bg-green-100 text-green-600 p-2 rounded-full flex-shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-lg text-slate-800 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ¿Cuándo NO usar serigrafía? */}
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
              {service.whenNotToUseTitle}
            </h3>
            <ul className="space-y-4">
              {service.whenNotToUse.map((item, idx) => (
                <li key={idx} className="p-5 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="mt-1 bg-red-100 text-red-600 p-2 rounded-full flex-shrink-0">
                      <XCircle size={20} />
                    </div>
                    <span className="text-lg text-slate-800 font-bold">{item.text}</span>
                  </div>
                  <p className="text-slate-600 ml-14">
                    <strong>Alternativa:</strong> {item.alternative}
                  </p>
                </li>
              ))}
            </ul>
            
            {/* NUEVO/CREAR: CTA inline hacia comparativa */}
            <div className="mt-6 text-center">
              <Link href="#comparativa">
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  ¿No estás seguro de qué técnica necesitas? → Consulta comparativa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 3: PROCESO Y VENTAJAS (20% - Confianza)
          ==================================================================== */}
      <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Proceso paso a paso - NUEVO/CREAR: Timeline visual */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              {service.processTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative">
                  {/* NUEVO/CREAR: Línea conectora entre pasos (solo desktop) */}
                  {idx < service.process.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-3 w-6 h-0.5 bg-blue-200"></div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{step.title}</h3>
                      <p className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                        <Clock size={14} /> {step.duration}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
            
            {/* NUEVO/CREAR: Fotos reales del proceso en IMPACTO33 */}
            <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500 italic text-center">
                [NUEVO/CREAR: Galería de fotos reales del proceso en IMPACTO33]
              </p>
            </div>
          </div>

          {/* Ventajas de la serigrafía profesional - NUEVO/CREAR: Grid 2x3 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              {service.advantagesTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.advantages.map((advantage, idx) => {
                const AdvantageIcon = advantage.icon;
                return (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <AdvantageIcon size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{advantage.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{advantage.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 4: NUESTRO SERVICIO (15% - Transición comercial)
          ==================================================================== */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Sobre nuestro servicio */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {service.ourServiceTitle}
            </h2>
            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
              {service.ourServiceContent.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Qué incluye nuestro servicio */}
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
              {service.serviceIncludesTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.serviceIncludes.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plazos de entrega - NUEVO/CREAR: Tabla simple */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
              {service.deliveryTimesTitle}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Cantidad</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Plazo orientativo*</th>
                  </tr>
                </thead>
                <tbody>
                  {service.deliveryTimes.map((row, idx) => (
                    <tr key={idx} className="border-t border-slate-200">
                      <td className="px-6 py-4 text-slate-700 font-medium">{row.quantity}</td>
                      <td className="px-6 py-4 text-slate-600">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500 mt-3">
              *Desde aprobación final de diseño. Plazos urgentes disponibles bajo consulta.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 5: CTA PRINCIPAL + FORMULARIO (10% - Conversión)
          ==================================================================== */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {service.ctaFormTitle}
            </h2>
            <p className="text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
              {service.ctaFormText}
            </p>
          </div>

          {/* NUEVO/CREAR: Formulario de contacto/presupuesto */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <p className="text-slate-600 text-center mb-6">
              [NUEVO/CREAR: Formulario de presupuesto con campos:<br/>
              - Nombre*, Email*, Teléfono*<br/>
              - Tipo de prenda (desplegable)<br/>
              - Cantidad aproximada*<br/>
              - Número de colores del diseño*<br/>
              - ¿Tienes diseño listo?<br/>
              - Mensaje/Detalles del proyecto<br/>
              - Checkbox política de privacidad<br/>
              - Botón CTA: "Pedir presupuesto gratuito"]
            </p>
            
            <div className="border-t border-slate-200 pt-6 mt-6 text-center text-slate-600">
              <p className="mb-2">📞 ¿Prefieres hablar? Llámanos: <strong>[Teléfono]</strong></p>
              <p className="mb-2">✉️ O escríbenos: <strong>[Email]</strong></p>
              <p className="text-sm text-slate-500">⏰ Horario: L-V 9:00-18:00h</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 6: CASOS DE USO + PORTFOLIO (10% - Prueba social)
          ==================================================================== */}
      <section id="trabajos" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Casos de uso habituales */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              {service.useCasesTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.useCases.map((useCase, idx) => {
                const UseCaseIcon = useCase.icon;
                return (
                  <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                      <UseCaseIcon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{useCase.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{useCase.description}</p>
                    <Link href={`#${useCase.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                        {useCase.cta} <ArrowRight className="inline-block ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Portfolio / Galería de trabajos */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              {service.portfolioTitle}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {service.gallery.map((img, idx) => (
                <div key={idx} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                      src={img} 
                      alt={`Ejemplo ${service.title} ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-slate-600 mb-4">
                <em>¿Quieres ver más ejemplos de nuestros trabajos?</em>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/portfolio">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    Ver portfolio completo →
                  </Button>
                </Link>
                <Link href="/catalogo.pdf" target="_blank">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    Descargar catálogo PDF →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 7: FAQ (Mejora SEO + Resuelve objeciones)
          ==================================================================== */}
      <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
              {service.faqTitle}
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              Resolvemos tus dudas técnicas antes de empezar.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {service.faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-slate-200 bg-white mb-3 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-800 hover:text-blue-600 py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-5 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 8: COMPARATIVA TÉCNICAS (Ayuda a decisión)
          ==================================================================== */}
      <section id="comparativa" className="py-12 md:py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
              {service.comparativeTitle}
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              Compara las características principales para elegir la mejor técnica para tu proyecto
            </p>
          </div>

          {/* NUEVO/CREAR: Tabla comparativa responsive */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-white">
                <tr>
                  {service.comparativeTable.headers.map((header, idx) => (
                    <th key={idx} className="px-6 py-4 text-left text-sm font-bold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {service.comparativeTable.rows.map((row, idx) => (
                  <tr key={idx} className={`border-t border-slate-200 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="px-6 py-4 text-slate-900 font-bold">{row.label}</td>
                    <td className="px-6 py-4 text-slate-700 bg-blue-50 font-medium">{row.serigrafia}</td>
                    <td className="px-6 py-4 text-slate-600">{row.dtf}</td>
                    <td className="px-6 py-4 text-slate-600">{row.digital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link href="/blog/comparativa-tecnicas-estampacion">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Ver comparativa completa de técnicas →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 9: CTA FINAL (Cierre con alternativas)
          ==================================================================== */}
      <section className="py-16 md:py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
            {service.finalCtaTitle}
          </h2>
          <p className="text-blue-100 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
            {service.finalCtaText}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/presupuesto-rapido">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg rounded-full font-bold shadow-xl transition-transform hover:scale-105 w-full sm:w-auto">
                Pedir Presupuesto
              </Button>
            </Link>
            <Link href="/servicios">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full font-bold w-full sm:w-auto">
                Ver otras técnicas
              </Button>
            </Link>
          </div>

          {/* NUEVO/CREAR: Opciones de contacto adicionales */}
          <div className="mt-10 pt-8 border-t border-blue-500/30">
            <p className="text-blue-100 mb-4">💬 ¿Tienes dudas? Chatea con nosotros</p>
            <p className="text-blue-100">📱 WhatsApp: <strong>[Número]</strong></p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECCIÓN 10: RELATED CONTENT (Internal Linking)
          NUEVO/CREAR: Artículos relacionados del blog
          ==================================================================== */}
      <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Artículos relacionados que te pueden interesar
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* NUEVO/CREAR: Cards de artículos relacionados */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📘</div>
              <h4 className="font-bold text-slate-900 mb-2">
                Qué es la serigrafía textil y cómo funciona
              </h4>
              <p className="text-slate-600 text-sm mb-4">
                Guía completa sobre el proceso de serigrafía paso a paso.
              </p>
              <Link href="/blog/guias-tutoriales/que-es-serigrafia-textil">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                  Leer artículo →
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">⚖️</div>
              <h4 className="font-bold text-slate-900 mb-2">
                Serigrafía vs DTF: ¿Cuál elegir para tu proyecto?
              </h4>
              <p className="text-slate-600 text-sm mb-4">
                Comparativa detallada para ayudarte a decidir.
              </p>
              <Link href="/blog/comparativas/serigrafia-vs-dtf">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                  Leer comparativa →
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="font-bold text-slate-900 mb-2">
                Mejores tejidos para serigrafiar
              </h4>
              <p className="text-slate-600 text-sm mb-4">
                Descubre qué telas dan mejor resultado con serigrafía.
              </p>
              <Link href="/blog/guias-tutoriales/mejores-tejidos-estampar">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                  Leer guía →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicePage;