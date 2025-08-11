'use client';

import { useRouter } from 'next/navigation';

export default function PortfolioNavbar({ activeCategory, onCategoryChange, locale }) {
  const router = useRouter();

  const categories = [
    { id: 'drone', label: 'Drone' },
    { id: 'diary', label: 'Diary' },
    { id: 'portrait', label: 'Portrait' },
    { id: 'video', label: 'Video' }
  ];

  const handleBackToHome = () => {
    router.push(`/${locale}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-6 md:p-8 z-50">
      {/* Bouton retour */}
      <button 
        onClick={handleBackToHome}
        className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border border-black text-white hover:text-yellow-300 transition-colors"
        style={{backgroundColor: 'rgba(251, 191, 36, 0.3)'}}
        title="Retour à l'accueil"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center flex-1">
        <div className="flex items-center space-x-8 backdrop-blur-md rounded-full px-8 py-3" style={{backgroundColor: 'rgba(251, 191, 36, 0.3)'}}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`transition-colors ${
                activeCategory === category.id 
                  ? 'text-yellow-300 font-semibold' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center space-x-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
              activeCategory === category.id 
                ? 'bg-yellow-400 bg-opacity-30 text-yellow-300 font-semibold' 
                : 'text-white hover:text-yellow-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </nav>
    </header>
  );
}