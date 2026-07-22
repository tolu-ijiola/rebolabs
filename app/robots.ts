import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rebolabs.ai'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/', '/login', '/signup', '/forgot-password', '/cookie-policy'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
