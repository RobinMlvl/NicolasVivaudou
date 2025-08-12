'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PortfolioNavbar from '../../../components/portfolio/PortfolioNavbar';

export default function PortfolioPage() {
  const params = useParams();
  const locale = params.locale || 'fr';
  
  const [allPhotos, setAllPhotos] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // États pour chaque catégorie
  const [showDrone, setShowDrone] = useState(false);
  const [showDiary, setShowDiary] = useState(true);
  const [showPortrait, setShowPortrait] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // États pour le lightbox
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Pattern de base pour 20 éléments qui se répète
  const basePattern = [
    { colSpan: 'col-span-2', rowSpan: '' },      // 1 - large horizontal
    { colSpan: '', rowSpan: 'row-span-2' },      // 2 - haut vertical
    { colSpan: '', rowSpan: '' },                // 3 - normal
    { colSpan: '', rowSpan: '' },                // 4 - normal (complète le row-span de 2)
    { colSpan: 'md:col-span-2', rowSpan: '' },   // 5 - large horizontal desktop
    { colSpan: '', rowSpan: 'row-span-2' },      // 6 - vertical
    { colSpan: '', rowSpan: 'row-span-2' },      // 7 - vertical desktop
    { colSpan: '', rowSpan: '' },                // 8 - normal
    { colSpan: 'col-span-2', rowSpan: 'md:row-span-2' }, // 9 - large + vertical desktop
    { colSpan: '', rowSpan: 'row-span-2' },      // 10 - vertical
    { colSpan: '', rowSpan: 'md:row-span-2' },   // 11 - vertical desktop
    { colSpan: '', rowSpan: 'row-span-2' },      // 12 - vertical
    { colSpan: '', rowSpan: '' },                // 13 - normal
    { colSpan: 'col-span-2', rowSpan: '' },      // 14 - large horizontal
    { colSpan: '', rowSpan: 'row-span-2' },      // 15 - vertical
    { colSpan: 'md:col-span-2', rowSpan: '' },   // 16 - large horizontal desktop
    { colSpan: '', rowSpan: '' },                // 17 - normal
    { colSpan: '', rowSpan: 'row-span-2' },      // 18 - vertical
    { colSpan: '', rowSpan: 'md:row-span-2' },   // 19 - vertical desktop
    { colSpan: '', rowSpan: '' }                 // 20 - normal
  ];

  // Charger toutes les photos une seule fois au début
  useEffect(() => {
    fetchAllPhotos();
  }, []);

  // Gestion des touches clavier pour le lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (getCurrentCategoryPhotos().length > 1) {
            navigateImage('prev');
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (getCurrentCategoryPhotos().length > 1) {
            navigateImage('next');
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentImageIndex]);

  // Nettoyer le style du body au démontage du composant
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const preloadImages = (imageUrls) => {
    return new Promise((resolve) => {
      let loaded = 0;
      const total = imageUrls.length;
      
      if (total === 0) {
        resolve();
        return;
      }
      
      // Précharger par petits lots pour éviter de surcharger le navigateur
      const batchSize = 3;
      let currentBatch = 0;
      
      const loadBatch = () => {
        const start = currentBatch * batchSize;
        const end = Math.min(start + batchSize, total);
        
        for (let i = start; i < end; i++) {
          const img = new window.Image();
          img.onload = img.onerror = () => {
            loaded++;
            if (loaded === total) {
              setImagesLoaded(true);
              resolve();
            } else if (loaded === end && end < total) {
              // Charger le prochain lot après un petit délai
              setTimeout(() => {
                currentBatch++;
                loadBatch();
              }, 100);
            }
          };
          img.src = imageUrls[i];
        }
      };
      
      loadBatch();
    });
  };

  const fetchAllPhotos = async () => {
    try {
      setImagesLoaded(false);
      
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      // Garder toutes les photos visibles (toutes catégories)
      const visiblePhotos = data.filter(photo => photo.visible !== false);
      
      setAllPhotos(visiblePhotos);
      
      // Précharger TOUTES les images de TOUTES les catégories
      const allImageUrls = visiblePhotos.map(photo => photo.imageUrl);
      await preloadImages(allImageUrls);
      
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      setAllPhotos([]);
      setImagesLoaded(true);
    }
  };

  const handleCategoryChange = (category) => {
    setShowDrone(category === 'drone');
    setShowDiary(category === 'diary');
    setShowPortrait(category === 'portrait');
    setShowVideo(category === 'video');
  };

  // Gestionnaires du lightbox
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    setVideoError(false); // Reset erreur vidéo
    // Désactiver le scroll du body
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setCurrentImageIndex(0);
    // Réactiver le scroll du body
    document.body.style.overflow = 'auto';
  };

  // Obtenir les photos de la catégorie active pour la navigation
  const getCurrentCategoryPhotos = () => {
    if (showDrone) return createPortfolioItems(dronePhotos);
    if (showDiary) return createPortfolioItems(diaryPhotos);
    if (showPortrait) return createPortfolioItems(portraitPhotos);
    if (showVideo) return createPortfolioItems(videoPhotos);
    return [];
  };

  const navigateImage = (direction) => {
    const currentPhotos = getCurrentCategoryPhotos();
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % currentPhotos.length 
      : (currentImageIndex - 1 + currentPhotos.length) % currentPhotos.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentPhotos[newIndex]);
  };

  // Séparer les photos par catégorie
  const dronePhotos = allPhotos.filter(photo => photo.category === 'drone');
  const diaryPhotos = allPhotos.filter(photo => photo.category === 'diary');
  const portraitPhotos = allPhotos.filter(photo => photo.category === 'portrait');
  const videoPhotos = allPhotos.filter(photo => photo.category === 'video');

  // Fonction pour créer les items de portfolio avec pattern
  const createPortfolioItems = (photos) => {
    return photos.map((photo, index) => {
      const patternIndex = index % 20;
      const pattern = basePattern[patternIndex];
      
      return {
        ...photo,
        colSpan: pattern.colSpan,
        rowSpan: pattern.rowSpan,
        patternIndex
      };
    });
  };



  return (
    <div className="fixed inset-0 m-0 p-0 overflow-auto bg-white">
      {/* Navbar Portfolio */}
      <PortfolioNavbar 
        activeCategory={showDrone ? 'drone' : showDiary ? 'diary' : showPortrait ? 'portrait' : 'video'}
        onCategoryChange={handleCategoryChange}
        locale={locale}
      />
      
      <div className="relative">
        {/* Grille Portfolio plein écran sans espaces - Rendu conditionnel */}
        
        {/* Catégorie Drone */}
        {showDrone && (
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[280px] w-full">
            {createPortfolioItems(dronePhotos).map((item, index) => (
              <div 
                key={item.id}
                className={`
                  relative overflow-hidden
                  hover:scale-[1.02] transition-transform duration-300 cursor-pointer
                  ${item.colSpan} ${item.rowSpan}
                `}
                onClick={() => openLightbox(item, index)}
              >
                {item.type === 'video' ? (
                  <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay muted loop playsInline
                    preload="auto"
                    onError={(e) => console.error('Erreur vidéo:', e)}
                    onLoadedData={() => console.log('Preview vidéo chargée:', item.title)}
                    style={{ filter: 'none' }}
                  >
                    <source src={item.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Portfolio image'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Catégorie Diary */}
        {showDiary && (
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[280px] w-full">
            {createPortfolioItems(diaryPhotos).map((item, index) => (
              <div 
                key={item.id}
                className={`
                  relative overflow-hidden
                  hover:scale-[1.02] transition-transform duration-300 cursor-pointer
                  ${item.colSpan} ${item.rowSpan}
                `}
                onClick={() => openLightbox(item, index)}
              >
                {item.type === 'video' ? (
                  <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay muted loop playsInline
                    preload="auto"
                    onError={(e) => console.error('Erreur vidéo:', e)}
                    onLoadedData={() => console.log('Preview vidéo chargée:', item.title)}
                    style={{ filter: 'none' }}
                  >
                    <source src={item.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Portfolio image'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Catégorie Portrait */}
        {showPortrait && (
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[280px] w-full">
            {createPortfolioItems(portraitPhotos).map((item, index) => (
              <div 
                key={item.id}
                className={`
                  relative overflow-hidden
                  hover:scale-[1.02] transition-transform duration-300 cursor-pointer
                  ${item.colSpan} ${item.rowSpan}
                `}
                onClick={() => openLightbox(item, index)}
              >
                {item.type === 'video' ? (
                  <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay muted loop playsInline
                    preload="auto"
                    onError={(e) => console.error('Erreur vidéo:', e)}
                    onLoadedData={() => console.log('Preview vidéo chargée:', item.title)}
                    style={{ filter: 'none' }}
                  >
                    <source src={item.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Portfolio image'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Catégorie Video */}
        {showVideo && (
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[280px] w-full">
            {createPortfolioItems(videoPhotos).map((item, index) => (
              <div 
                key={item.id}
                className={`
                  relative overflow-hidden
                  hover:scale-[1.02] transition-transform duration-300 cursor-pointer
                  ${item.colSpan} ${item.rowSpan}
                `}
                onClick={() => openLightbox(item, index)}
              >
                {item.type === 'video' ? (
                  <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay muted loop playsInline
                    preload="auto"
                    onError={(e) => console.error('Erreur vidéo:', e)}
                    onLoadedData={() => console.log('Preview vidéo chargée:', item.title)}
                    style={{ filter: 'none' }}
                  >
                    <source src={item.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Portfolio image'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message si aucune photo - seulement après chargement */}
        {imagesLoaded && dronePhotos.length === 0 && diaryPhotos.length === 0 && portraitPhotos.length === 0 && videoPhotos.length === 0 && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio en construction</h3>
              <p className="text-gray-600">Les photos seront bientôt disponibles</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Lightbox */}
      {isLightboxOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 backdrop-blur-sm"
            style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
          ></div>
          {/* Contenu du modal */}
          <div 
            className="relative max-w-screen-xl max-h-screen-xl w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermeture */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-60 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
              title="Fermer (Échap)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation précédent */}
            {getCurrentCategoryPhotos().length > 1 && (
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                title="Image précédente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Navigation suivant */}
            {getCurrentCategoryPhotos().length > 1 && (
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                title="Image suivante"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Image ou vidéo */}
            <div className="relative w-full h-full flex items-center justify-center">
              {selectedImage.type === 'video' && !videoError ? (
                <video 
                  className="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl"
                  controls
                  autoPlay
                  loop
                  preload="auto"
                  playsInline
                  onError={(e) => {
                    console.error('Erreur lightbox vidéo:', e);
                    setVideoError(true);
                  }}
                  onLoadedData={() => console.log('Vidéo chargée avec succès:', selectedImage.title)}
                >
                  <source src={selectedImage.imageUrl} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              ) : selectedImage.type === 'video' && videoError ? (
                <div className="max-w-[90vw] max-h-[80vh] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-8">
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de lecture vidéo</h3>
                    <p className="text-gray-600 mb-4">La vidéo n&apos;a pas pu être chargée</p>
                    <button 
                      onClick={() => setVideoError(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title || 'Portfolio image'}
                  className="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl"
                  loading="eager"
                />
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}