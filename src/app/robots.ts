import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/callback',
        '/dashboard/settings',
        '/payment/',
        '/checkout/',
      ],
    },
    sitemap: `${process.env.NEXT_PROJECT_API_URL}/sitemap.xml`,
  };
}
