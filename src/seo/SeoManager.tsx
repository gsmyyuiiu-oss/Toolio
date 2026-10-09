import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  schema?: Record<string, any>;
}

export const SeoManager: React.FC<SeoProps> = ({
  title,
  description,
  canonicalPath = '/',
  ogType = 'website',
  schema,
}) => {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // 2. Helper to set or create meta tags
    const setMeta = (nameOrProp: string, value: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${nameOrProp}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, nameOrProp);
        document.head.appendChild(tag);
      }
      tag.content = value;
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', 'Toolio', true);

    const fullUrl = window.location.origin + (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`);
    setMeta('og:url', fullUrl, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    // 3. Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    // 4. Update Schema.org JSON-LD
    const existingScript = document.getElementById('toolio-schema-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'toolio-schema-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('toolio-schema-jsonld');
      if (s) s.remove();
    };
  }, [title, description, canonicalPath, ogType, schema]);

  return null;
};
