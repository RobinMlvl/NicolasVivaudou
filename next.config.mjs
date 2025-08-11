import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour les uploads de fichiers
  experimental: {
    // Augmenter la limite de taille des Server Actions pour les vidéos
    serverActions: {
      bodySizeLimit: '1gb' // 1GB pour permettre les gros fichiers vidéo
    }
  },
  // Configuration des images externes autorisées
  images: {
    domains: [
      'via.placeholder.com', // Pour les images de test
      'placehold.co', // Alternative placeholder
      'images.unsplash.com', // Si vous utilisez Unsplash
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Configuration de qualité
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    // Tailles disponibles pour l'optimisation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};

export default withNextIntl(nextConfig);
