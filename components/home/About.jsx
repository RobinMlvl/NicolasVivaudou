'use client';

import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations();

  return (
    <section 
      id="about-section"
      className="relative h-screen overflow-hidden"
    >
      {/* Background with different behavior for mobile/desktop */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/portfolio-home/about.jpg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          // CSS-only mobile detection
          backgroundAttachment: 'scroll', // Default for mobile
        }}
      >
        {/* Desktop parallax with media query */}
        <style jsx>{`
          @media (min-width: 769px) and (hover: hover) and (pointer: fine) {
            div {
              background-attachment: fixed !important;
            }
          }
        `}</style>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-20">
        <div className="text-center text-white max-w-4xl">
          <h2 className="text-white mb-6">
            Nicolas Vivaudou
          </h2>
          <div className="p-8">
            <div className="text-lg md:text-2xl leading-relaxed">
              {t('about.biography').split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}