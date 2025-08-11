import { Quicksand, Roboto } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '../../src/i18n/routing';
import Navbar from '../../components/home/Navbar';

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nicolasvivaudou.com';
  
  return {
    title: locale === 'fr' 
      ? 'Nicolas Vivaudou - Photographe Professionnel | Portrait & Drone' 
      : 'Nicolas Vivaudou - Professional Photographer | Portrait & Drone',
    
    description: locale === 'fr' 
      ? 'Photographe professionnel spécialisé en portrait et photographie par drone. Découvrez mon univers visuel entre lumière, visages et paysages immenses. Basé à Montréal, disponible pour vos projets créatifs.' 
      : 'Professional photographer specializing in portrait and drone photography. Discover my visual universe between light, faces and vast landscapes. Based in Montreal, available for your creative projects.',
    
    keywords: locale === 'fr'
      ? 'photographe, portrait, drone, Montréal, Canada, photographie professionnelle, Nicolas Vivaudou, photographe professionnel, shooting photo, aerial photography'
      : 'photographer, portrait, drone, Montreal, Canada, professional photography, Nicolas Vivaudou, professional photographer, photo shoot, aerial photography',
    
    authors: [{ name: 'Nicolas Vivaudou' }],
    creator: 'Nicolas Vivaudou',
    publisher: 'Nicolas Vivaudou',
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      alternateLocale: locale === 'fr' ? 'en_CA' : 'fr_CA',
      url: `${siteUrl}/${locale === 'fr' ? '' : locale}`,
      title: locale === 'fr' 
        ? 'Nicolas Vivaudou - Photographe Professionnel | Portfolio' 
        : 'Nicolas Vivaudou - Professional Photographer | Portfolio',
      description: locale === 'fr' 
        ? 'Photographe professionnel spécialisé en portrait et photographie par drone. Découvrez mon portfolio et contactez-moi pour vos projets.' 
        : 'Professional photographer specializing in portrait and drone photography. Discover my portfolio and contact me for your projects.',
      siteName: 'Nicolas Vivaudou Photography',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'fr' ? 'Portfolio Nicolas Vivaudou - Photographe' : 'Nicolas Vivaudou Portfolio - Photographer',
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: locale === 'fr' 
        ? 'Nicolas Vivaudou - Photographe Professionnel' 
        : 'Nicolas Vivaudou - Professional Photographer',
      description: locale === 'fr' 
        ? 'Portrait & Drone | Montréal, Canada' 
        : 'Portrait & Drone | Montreal, Canada',
      images: [`${siteUrl}/og-image.jpg`],
      creator: '@nicolasvivaudou',
    },
    
    alternates: {
      canonical: `${siteUrl}/${locale === 'fr' ? '' : locale}`,
      languages: {
        'fr-CA': `${siteUrl}`,
        'en-CA': `${siteUrl}/en`,
        'x-default': `${siteUrl}`,
      },
    },
    
    other: {
      'geo.region': 'CA-QC',
      'geo.placename': 'Montreal',
      'geo.position': '45.5017;-73.5673',
      'ICBM': '45.5017, -73.5673',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${quicksand.variable} ${roboto.variable} antialiased`}>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}