export default function manifest() {
  return {
    name: 'Nicolas Vivaudou Photography',
    short_name: 'NV Photo',
    description: 'Portfolio professionnel de Nicolas Vivaudou - Photographe spécialisé en portrait et drone',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['photography', 'portfolio', 'creative'],
    lang: 'fr',
    orientation: 'portrait-primary',
    scope: '/',
    related_applications: [
      {
        platform: 'web',
        url: 'https://nicolasvivaudou.com',
      },
    ],
  }
}