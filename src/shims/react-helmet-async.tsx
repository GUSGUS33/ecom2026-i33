// TODO: reemplazar shim por generateMetadata nativo de Next.js — este archivo es temporal para la migración
// Proporciona las mismas APIs que react-helmet-async (Helmet, HelmetProvider)
// En Next.js App Router, el metadata se gestiona con generateMetadata() en Server Components.
// Este shim permite que los Client Components existentes sigan usando <Helmet> sin romper.
"use client";

import React from "react";
import Head from "next/head";

interface HelmetProps {
  children?: React.ReactNode;
}

// Helmet renders meta tags via next/head for client components
export function Helmet({ children }: HelmetProps) {
  const elements: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    const el = child as React.ReactElement<Record<string, any>>;
    const type = el.type as string;

    if (type === "title") {
      elements.push(
        <title key="title">{el.props.children}</title>
      );
    } else if (type === "meta") {
      const { children: _c, ...metaProps } = el.props;
      elements.push(
        <meta key={el.props.name || el.props.property || `meta-${elements.length}`} {...metaProps} />
      );
    } else if (type === "link") {
      const { children: _c, ...linkProps } = el.props;
      elements.push(
        <link key={el.props.rel || el.props.href || `link-${elements.length}`} {...linkProps} />
      );
    } else if (type === "script") {
      if (el.props.type === "application/ld+json") {
        elements.push(
          <script
            key={`ld-json-${elements.length}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: el.props.children as string }}
          />
        );
      }
    }
  });

  if (elements.length === 0) return null;

  return <Head>{elements}</Head>;
}

// HelmetProvider is a no-op in Next.js — Head works without a provider
export function HelmetProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default { Helmet, HelmetProvider };
