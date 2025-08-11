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
      ? 'Photographe professionnel spécialisé en portrait et photographie par drone. Découvrez mon portfolio créatif à Montréal. Services photo professionnels pour particuliers et entreprises.' 
      : 'Professional photographer specializing in portrait and drone photography. Discover my creative portfolio in Montreal. Professional photo services for individuals and businesses.',
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      url: `${siteUrl}/${locale === 'fr' ? '' : locale}`,
      siteName: 'Nicolas Vivaudou Photography',
      title: locale === 'fr' 
        ? 'Nicolas Vivaudou - Photographe Professionnel' 
        : 'Nicolas Vivaudou - Professional Photographer',
      description: locale === 'fr' 
        ? 'Portfolio photographe professionnel - Portrait & Drone | Montréal' 
        : 'Professional photographer portfolio - Portrait & Drone | Montreal',
    },
    
    alternates: {
      canonical: `${siteUrl}/${locale === 'fr' ? '' : locale}`,
      languages: {
        'fr-CA': siteUrl,
        'en-CA': `${siteUrl}/en`,
        'x-default': siteUrl,
      },
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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={
          locale === 'fr' 
            ? 'Photographe professionnel spécialisé en portrait et photographie par drone. Découvrez mon portfolio créatif à Montréal. Services photo professionnels pour particuliers et entreprises.'
            : 'Professional photographer specializing in portrait and drone photography. Discover my creative portfolio in Montreal. Professional photo services for individuals and businesses.'
        } />
      </head>
      <body className={`${quicksand.variable} ${roboto.variable} antialiased`}>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}