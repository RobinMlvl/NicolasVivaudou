'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export default function About() {
  const t = useTranslations();
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Optimized parallax scroll handler with RAF
    let ticking = false;
    
    const updateParallax = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3; // Parallax speed (reduced for smoother effect)
      
      setOffsetY(rate);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (isMobile) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isMobile]);

  const backgroundStyle = isMobile ? {
    backgroundImage: 'url(/portfolio-home/about.jpg)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    transform: `translateY(${offsetY}px)`,
    willChange: 'transform'
  } : {
    backgroundImage: 'url(/portfolio-home/about.jpg)',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  };

  return (
    <section 
      ref={sectionRef}
      id="about-section"
      className="relative h-screen overflow-hidden"
      style={backgroundStyle}
    >

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
        <div className="text-center text-white max-w-4xl">
          <h2 className="text-white mb-6">
            Nicolas Vivaudou
          </h2>
          <div className="p-8">
            <div className="text-xl md:text-2xl leading-relaxed">
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