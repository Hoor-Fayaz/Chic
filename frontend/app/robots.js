export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/checkout/'],
    },
    sitemap: 'https://jannahchic.com/sitemap.xml',
  }
}
