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
    title: locale === 'fr' ? 'Nicolas Vivaudo - Portfolio' : 'Nicolas Vivaudo - Portfolio',
    description: locale === 'fr' 
      ? 'Portfolio professionnel de Nicolas Vivaudo' 
      : 'Professional portfolio of Nicolas Vivaudo',
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
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}