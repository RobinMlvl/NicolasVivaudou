'use client';

import { NextIntlClientProvider } from 'next-intl';
import { Link } from '../../../src/i18n/navigation';
import { usePathname, useParams } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function AdminLocaleLayout({ children }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale || 'fr';
  return (
    <NextIntlClientProvider locale={locale}>
      <div className="min-h-screen bg-gray-100">
        {/* Header Admin */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Retour au site
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Dashboard Admin
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4" style={{fontFamily: 'var(--font-quicksand)'}}>
                Gestion du contenu
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/admin/portfolio"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname.includes('/admin/portfolio')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/contact"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname.includes('/admin/contact')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Contenu principal */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}