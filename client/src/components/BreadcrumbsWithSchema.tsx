interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsWithSchemaProps {
  customPath?: BreadcrumbItem[];
  currentPageTitle: string;
}

/**
 * Componente de Breadcrumbs con BreadcrumbList Schema (JSON-LD)
 * Mejora SEO y aparición en rich snippets de Google
 */
export function BreadcrumbsWithSchema({ customPath, currentPageTitle }: BreadcrumbsWithSchemaProps) {
  // Generar BreadcrumbList Schema para SEO
  const breadcrumbItems = [
    { name: 'Inicio', url: window.location.origin + '/' },
    ...(customPath
      ?.filter((item) => item.label.toLowerCase() !== 'inicio')
      .map((item) => ({
        name: item.label,
        url: item.url ? window.location.origin + item.url : undefined
      })) || []),
    { name: currentPageTitle, url: window.location.href }
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <div className="bg-slate-50 py-4">
      {/* BreadcrumbList Schema (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-2 text-sm text-slate-600">
          <a href="/" className="hover:text-blue-600">
            Inicio
          </a>
          {customPath
            ?.filter((item) => item.label.toLowerCase() !== 'inicio')
            .map((item, index) => (
            <span key={index} className="flex items-center space-x-2">
              <span>/</span>
              {item.url ? (
                <a href={item.url} className="hover:text-blue-600">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </span>
          ))}
          <span>/</span>
          <span className="text-slate-900 font-medium">{currentPageTitle}</span>
        </nav>
      </div>
    </div>
  );
}
