export async function GET() {
  const robotsContent = `User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /_vercel/

Sitemap: https://nicolasvivaudou.com/sitemap.xml`;

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}