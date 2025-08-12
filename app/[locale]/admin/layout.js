'use client';

import { useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Link } from '../../../src/i18n/navigation';
import { usePathname, useParams } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function AdminLocaleLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale || 'fr';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <NextIntlClientProvider locale={locale}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Admin */}
        <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 relative z-30">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Menu burger - visible seulement sur mobile */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 shadow-md transition-all duration-200"
                  aria-label="Ouvrir le menu"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Titre avec branding */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent" style={{fontFamily: 'var(--font-quicksand)'}}>
                      Admin Panel
                    </h1>
                    <p className="hidden sm:block text-xs text-gray-500 font-medium">
                      Nicolas Vivaudou Portfolio
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/50
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Header mobile de la sidebar */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 lg:hidden">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent" style={{fontFamily: 'var(--font-quicksand)'}}>
                  Menu Admin
                </h2>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-colors"
                aria-label="Fermer le menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Retour au site - en haut de la sidebar */}
              <div>
                <Link 
                  href="/"
                  onClick={closeSidebar}
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm group"
                >
                  <svg className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <div>
                    <div className="font-medium">Retour au site</div>
                    <div className="text-xs text-gray-500">Voir le portfolio</div>
                  </div>
                </Link>
              </div>

              {/* Navigation principale */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
                  Gestion du contenu
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/admin/portfolio"
                      onClick={closeSidebar}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                        pathname.includes('/admin/portfolio')
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/25'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 hover:text-yellow-700'
                      }`}
                    >
                      <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-medium">Portfolio</div>
                        <div className="text-xs opacity-75">Images et vidéos</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/admin/contact"
                      onClick={closeSidebar}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                        pathname.includes('/admin/contact')
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/25'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 hover:text-yellow-700'
                      }`}
                    >
                      <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-medium">Messages</div>
                        <div className="text-xs opacity-75">Formulaire de contact</div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Section infos */}
              <div className="hidden lg:block border-t border-gray-200/50 pt-6">
                <div className="px-4 py-3 bg-gradient-to-r from-yellow-50/50 to-yellow-100/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">Nicolas Vivaudou</div>
                      <div className="text-gray-500">Photographe</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Overlay pour fermer la sidebar sur mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}

          {/* Contenu principal */}
          <main className="flex-1 p-4 sm:p-6 lg:ml-0 bg-gray-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}