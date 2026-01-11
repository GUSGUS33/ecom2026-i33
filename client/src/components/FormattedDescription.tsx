/**
 * FormattedDescription Component
 * 
 * Procesa y mejora el HTML de descripciones de WooCommerce
 * Añade clases Tailwind para mejor formato y legibilidad
 * 
 * Características:
 * - Sanitiza HTML para evitar XSS
 * - Añade estilos Tailwind a párrafos, listas, tablas, etc.
 * - Mejora espaciado y tipografía
 * - Preserva estructura original del HTML
 */

interface FormattedDescriptionProps {
  html: string;
  className?: string;
}

/**
 * Procesa el HTML y añade clases Tailwind para mejor formato
 */
function enhanceHtmlWithTailwind(html: string): string {
  let enhanced = html;

  // Mejorar párrafos: añadir espaciado y tamaño de fuente
  enhanced = enhanced.replace(
    /<p([^>]*)>/g,
    '<p$1 class="mb-4 leading-relaxed text-base text-slate-700">'
  );

  // Mejorar encabezados H1, H2, H3, H4, H5, H6
  enhanced = enhanced.replace(
    /<h1([^>]*)>/g,
    '<h1$1 class="text-3xl font-bold mt-8 mb-4 text-slate-900">'
  );
  enhanced = enhanced.replace(
    /<h2([^>]*)>/g,
    '<h2$1 class="text-2xl font-bold mt-6 mb-3 text-slate-900">'
  );
  enhanced = enhanced.replace(
    /<h3([^>]*)>/g,
    '<h3$1 class="text-xl font-bold mt-5 mb-2 text-slate-800">'
  );
  enhanced = enhanced.replace(
    /<h4([^>]*)>/g,
    '<h4$1 class="text-lg font-bold mt-4 mb-2 text-slate-800">'
  );
  enhanced = enhanced.replace(
    /<h5([^>]*)>/g,
    '<h5$1 class="text-base font-bold mt-3 mb-2 text-slate-800">'
  );
  enhanced = enhanced.replace(
    /<h6([^>]*)>/g,
    '<h6$1 class="text-sm font-bold mt-2 mb-2 text-slate-800">'
  );

  // Mejorar listas desordenadas
  enhanced = enhanced.replace(
    /<ul([^>]*)>/g,
    '<ul$1 class="list-disc list-inside mb-4 space-y-2 text-slate-700">'
  );

  // Mejorar listas ordenadas
  enhanced = enhanced.replace(
    /<ol([^>]*)>/g,
    '<ol$1 class="list-decimal list-inside mb-4 space-y-2 text-slate-700">'
  );

  // Mejorar items de lista
  enhanced = enhanced.replace(
    /<li([^>]*)>/g,
    '<li$1 class="ml-2 text-slate-700">'
  );

  // Mejorar blockquotes
  enhanced = enhanced.replace(
    /<blockquote([^>]*)>/g,
    '<blockquote$1 class="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-slate-600 bg-blue-50 rounded-r">'
  );

  // Mejorar tablas
  enhanced = enhanced.replace(
    /<table([^>]*)>/g,
    '<table$1 class="w-full border-collapse my-4 border border-slate-300">'
  );

  enhanced = enhanced.replace(
    /<thead([^>]*)>/g,
    '<thead$1 class="bg-slate-100">'
  );

  enhanced = enhanced.replace(
    /<th([^>]*)>/g,
    '<th$1 class="border border-slate-300 px-4 py-2 text-left font-bold text-slate-900">'
  );

  enhanced = enhanced.replace(
    /<td([^>]*)>/g,
    '<td$1 class="border border-slate-300 px-4 py-2 text-slate-700">'
  );

  // Mejorar imágenes
  enhanced = enhanced.replace(
    /<img([^>]*?)>/g,
    '<img$1 class="max-w-full h-auto rounded-lg my-4" />'
  );

  // Mejorar enlaces
  enhanced = enhanced.replace(
    /<a([^>]*?)href="([^"]*)"([^>]*)>/g,
    '<a$1href="$2"$3 class="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors">'
  );

  // Mejorar código inline
  enhanced = enhanced.replace(
    /<code([^>]*)>/g,
    '<code$1 class="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">'
  );

  // Mejorar bloques de código
  enhanced = enhanced.replace(
    /<pre([^>]*)>/g,
    '<pre$1 class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">'
  );

  // Mejorar énfasis (strong, em, b, i)
  enhanced = enhanced.replace(
    /<strong([^>]*)>/g,
    '<strong$1 class="font-bold text-slate-900">'
  );

  enhanced = enhanced.replace(
    /<b([^>]*)>/g,
    '<b$1 class="font-bold text-slate-900">'
  );

  enhanced = enhanced.replace(
    /<em([^>]*)>/g,
    '<em$1 class="italic text-slate-700">'
  );

  enhanced = enhanced.replace(
    /<i([^>]*)>/g,
    '<i$1 class="italic text-slate-700">'
  );

  // Mejorar saltos de línea (br)
  enhanced = enhanced.replace(
    /<br\s*\/?>/g,
    '<br class="my-2" />'
  );

  // Mejorar divisores horizontales
  enhanced = enhanced.replace(
    /<hr\s*\/?>/g,
    '<hr class="my-6 border-t border-slate-300" />'
  );

  return enhanced;
}

/**
 * Sanitiza el HTML para evitar XSS
 * Nota: En producción, considera usar DOMPurify o similar
 */
function sanitizeHtml(html: string): string {
  // Crear un div temporal para parsear el HTML
  const temp = document.createElement('div');
  temp.textContent = html;
  
  // Permitir solo etiquetas seguras
  const allowedTags = [
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'b', 'i',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'img', 'a', 'code', 'pre', 'span', 'div'
  ];

  // Si el HTML contiene etiquetas peligrosas, lo sanitizamos
  const dangerousPatterns = [/<script/gi, /on\w+\s*=/gi, /javascript:/gi];
  let isSafe = !dangerousPatterns.some(pattern => pattern.test(html));

  if (!isSafe) {
    console.warn('⚠️ HTML potencialmente peligroso detectado en descripción. Sanitizando...');
    // Remover scripts y event handlers
    html = html.replace(/<script[^>]*>.*?<\/script>/gi, '');
    html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    html = html.replace(/javascript:/gi, '');
  }

  return html;
}

export function FormattedDescription({
  html,
  className = '',
}: FormattedDescriptionProps) {
  if (!html) {
    return null;
  }

  // Sanitizar HTML
  const sanitized = sanitizeHtml(html);

  // Mejorar HTML con clases Tailwind
  const enhanced = enhanceHtmlWithTailwind(sanitized);

  return (
    <div
      className={`prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: enhanced }}
    />
  );
}
