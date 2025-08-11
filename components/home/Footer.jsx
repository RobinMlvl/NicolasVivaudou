export default function Footer() {
  return (
    <footer 
      className="relative text-white"
      style={{
        backgroundImage: 'url(/footer.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 flex flex-col min-h-[200px]">
        {/* Main Footer Content */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left">
                <h3 className="text-lg text-white mb-1">Nicolas Vivaudou</h3>
                <p className="text-sm text-gray-300">Montreal, Canada</p>
              </div>
              
              {/* Social Media Icons */}
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <a 
                  href="https://instagram.com/nicolasvivaudou" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.behance.net/nicolasvivaudou" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Behance"
                >
                  <img 
                    src="/behance.png" 
                    alt="Behance" 
                    className="w-8 h-8 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Section - Stuck to bottom */}
        <div className="border-t border-gray-600 py-3">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs text-gray-400 text-center">© {new Date().getFullYear()} Nicolas Vivaudou. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}