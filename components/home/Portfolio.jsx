'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../src/i18n/navigation';
import Image from 'next/image';

export default function Portfolio() {
  const t = useTranslations();

  return (
    <section id="portfolio-section" className="py-16 px-6 bg-gray-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-block relative">
            <h2 className="section-title text-gray-900 mb-0 p-0">
              {t('portfolio.title')}
            </h2>
            <div className="absolute top-full right-0">
              <Link 
                href="/portfolio" 
                className="text-yellow-500 hover:text-yellow-600 transition-colors font-medium"
                style={{fontFamily: 'var(--font-roboto)'}}
              >
                {t('portfolio.seeAll')}
              </Link>
            </div>
          </div>
        </div>

        {/* Grid Portfolio - Tailwind Only */}
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[250px] md:auto-rows-[280px] gap-4 max-w-4xl mx-auto">
          {/* Item 1 */}
          <div className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer col-span-2 md:col-span-1">
            <Image
              src="/portfolio-home/06.jpg"
              alt="Portfolio item 1"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          {/* Item 2 */}
          <div className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer md:row-span-2">
            <Image
              src="/portfolio-home/10.jpg"
              alt="Portfolio item 2"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          {/* Item 3 */}
          <div className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer md:row-span-2">
            <Image
              src="/portfolio-home/03.jpg"
              alt="Portfolio item 3"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          {/* Item 4 */}
          <div className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer col-span-2 md:col-span-1 md:row-span-2">
            <Image
              src="/portfolio-home/04.jpg"
              alt="Portfolio item 4"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          {/* Item 5 */}
          <div className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer md:col-span-2">
            <Image
              src="/portfolio-home/05.jpg"
              alt="Portfolio item 5"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          {/* Item 6 - Video */}
          <div className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer md:col-span-2">
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source src="/portfolio-home/01.mp4" type="video/mp4" />
            </video>
          </div>
          {/* Item 7 */}
          <div className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer hidden md:block">
            <Image
              src="/portfolio-home/07.jpg"
              alt="Portfolio item 7"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}