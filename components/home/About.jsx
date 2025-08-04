'use client';

import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations();

  return (
    <section 
      className="relative h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/portfolio-home/about.jpg)',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
        <div className="text-center text-white max-w-4xl">
          <h2 className="text-white mb-6">
            Nicolas Vivaudou
          </h2>
          <div className="p-8">
            <p className="text-xl md:text-2xl leading-relaxed">
              {t('about.biography')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}