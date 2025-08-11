'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '../../src/i18n/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale) => {
    router.replace(pathname, {locale: newLocale});
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <header className="flex items-center justify-between p-6 md:p-8 relative z-50">
      {/* Logo/Name */}
      <div className="text-white text-lg md:text-xl" style={{fontFamily: 'var(--font-quicksand)'}}>
        Nicolas Vivaudou
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center flex-1">
        <div className="flex items-center space-x-8 backdrop-blur-md rounded-full px-6 py-2" style={{backgroundColor: 'rgba(251, 191, 36, 0.3)'}}>
          <button onClick={() => scrollToSection('portfolio-section')} className="text-white hover:text-blue-300 transition-colors">
            {t('nav.portfolio')}
          </button>
          <button onClick={() => scrollToSection('about-section')} className="text-white hover:text-blue-300 transition-colors">
            {t('nav.about')}
          </button>
          <button onClick={() => scrollToSection('services-section')} className="text-white hover:text-blue-300 transition-colors">
            {t('nav.services')}
          </button>
          <button onClick={() => scrollToSection('contact-section')} className="text-white hover:text-blue-300 transition-colors">
            {t('nav.contact')}
          </button>
          
          {/* Language Selector */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <span>{locale.toUpperCase()}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Language Dropdown */}
            {isLangOpen && (
              <div className="absolute top-full mt-2 right-0 bg-yellow-400 bg-opacity-90 backdrop-blur-md rounded-lg py-2 min-w-16 border border-yellow-400">
                <button 
                  className="block w-full px-4 py-2 text-white hover:bg-yellow-500 hover:bg-opacity-50 transition-colors text-left"
                  onClick={() => {
                    changeLanguage('fr');
                    setIsLangOpen(false);
                  }}
                >
                  {t('language.fr')}
                </button>
                <button 
                  className="block w-full px-4 py-2 text-white hover:bg-yellow-500 hover:bg-opacity-50 transition-colors text-left"
                  onClick={() => {
                    changeLanguage('en');
                    setIsLangOpen(false);
                  }}
                >
                  {t('language.en')}
                </button>
              </div>
            )}
          </div>

          {/* Instagram Icon */}
          <Link href="https://instagram.com" target="_blank" className="text-white hover:text-blue-300 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md z-20">
          <nav className="flex flex-col space-y-4 p-6">
            <button onClick={() => scrollToSection('portfolio-section')} className="text-white hover:text-blue-300 transition-colors text-left">
              {t('nav.portfolio')}
            </button>
            <button onClick={() => scrollToSection('about-section')} className="text-white hover:text-blue-300 transition-colors text-left">
              {t('nav.about')}
            </button>
            <button onClick={() => scrollToSection('services-section')} className="text-white hover:text-blue-300 transition-colors text-left">
              {t('nav.services')}
            </button>
            <button onClick={() => scrollToSection('contact-section')} className="text-white hover:text-blue-300 transition-colors text-left">
              {t('nav.contact')}
            </button>
            <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
              <div className="flex items-center space-x-2">
                <span className="text-white">{locale.toUpperCase()}</span>
                <button 
                  className="text-white text-sm"
                  onClick={() => changeLanguage(locale === 'fr' ? 'en' : 'fr')}
                >
                  ↓
                </button>
              </div>
              <Link href="https://instagram.com" target="_blank" className="text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}