import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const indexing=process.env.SITE_INDEXING_ENABLED==='true';
  return {
    rules: indexing?{userAgent:'*',allow:'/'}:{userAgent:'*',disallow:'/'},
    sitemap: indexing?'https://www.cuddlecrewpetcare.com/sitemap.xml':undefined,
  };
}
