import { PageBlock } from '@/queries/seoPageComplete';

interface HtmlBlockProps {
  data: PageBlock;
}

/**
 * Bloque de contenido HTML/Texto
 * Renderiza contenido HTML desde WordPress
 */
export function HtmlBlock({ data }: HtmlBlockProps) {
  if (!data.htmlContenido) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {data.htmlTitulo && (
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
          {data.htmlTitulo}
        </h2>
      )}
      <div
        className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700"
        dangerouslySetInnerHTML={{ __html: data.htmlContenido }}
      />
    </div>
  );
}
