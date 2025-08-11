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
  
  return {
    title: locale === 'fr' 
      ? 'Nicolas Vivaudou - Photographe Professionnel | Portrait & Drone' 
      : 'Nicolas Vivaudou - Professional Photographer | Portrait & Drone',
    
    description: locale === 'fr' 
      ? 'Photographe professionnel spécialisé en portrait et photographie par drone. Basé à Montréal.' 
      : 'Professional photographer specializing in portrait and drone photography. Based in Montreal.',
    
    robots: {
      index: true,
      follow: true,
    },
    
    openGraph: {
      title: locale === 'fr' 
        ? 'Nicolas Vivaudou - Photographe Professionnel' 
        : 'Nicolas Vivaudou - Professional Photographer',
      description: locale === 'fr' 
        ? 'Portrait & Drone | Montréal' 
        : 'Portrait & Drone | Montreal',
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