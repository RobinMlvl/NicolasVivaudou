'use client';

import { useState, useEffect } from 'react';
import PhotoGrid from '../../../../components/admin/PhotoGrid';
import PhotoUpload from '../../../../components/admin/PhotoUpload';
import PhotoEditor from '../../../../components/admin/PhotoEditor';

export default function AdminPortfolioPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Charger les photos
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/portfolio');
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newPhoto) => {
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleEditPhoto = (photo) => {
    setSelectedPhoto(photo);
    setIsEditing(true);
  };

  const handleDeletePhoto = async (photoId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
      try {
        await fetch(`/api/admin/portfolio/${photoId}`, {
          method: 'DELETE',
        });
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleUpdatePhoto = async (updatedPhoto) => {
    try {
      const response = await fetch(`/api/admin/portfolio/${updatedPhoto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPhoto),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setPhotos(prev => prev.map(p => p.id === updated.id ? updated : p));
        setIsEditing(false);
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleReorderPhotos = async (newOrder) => {
    setPhotos(newOrder);
    
    // Sauvegarder le nouvel ordre
    try {
      await fetch('/api/admin/portfolio/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photos: newOrder }),
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
    }
  };

  // Calculer les statistiques par catégorie
  const getPhotosByCategory = (category) => {
    return photos.filter(photo => photo.category === category);
  };

  const getVisiblePhotosByCategory = (category) => {
    return photos.filter(photo => photo.category === category && photo.visible !== false);
  };

  // Filtrer les photos selon la catégorie sélectionnée
  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  // Définir les catégories disponibles
  const categories = [
    { id: 'all', label: 'Toutes', icon: '📁' },
    { id: 'drone', label: 'Drone', icon: '🚁' },
    { id: 'diary', label: 'Diary', icon: '📖' },
    { id: 'portrait', label: 'Portrait', icon: '👤' },
    { id: 'video', label: 'Video', icon: '🎬' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-quicksand)'}}>
          Gestion du Portfolio
        </h1>
        <p className="text-gray-600">
          Ajoutez, modifiez et organisez vos photos de portfolio
        </p>
      </div>

      {/* Zone d'upload */}
      <div className="mb-8">
        <PhotoUpload onUploadComplete={handleUploadComplete} />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{photos.length}</div>
              <div className="text-sm text-gray-600">Médias total</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{photos.filter(p => p.visible !== false).length}</div>
              <div className="text-sm text-gray-600">Médias visibles</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-xl">🎬</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{getPhotosByCategory('video').length}</div>
              <div className="text-sm text-gray-600">Vidéos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-xl">🚁</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{getPhotosByCategory('drone').length}</div>
              <div className="text-sm text-gray-600">Photos Drone</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <span className="text-xl">📖</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{getPhotosByCategory('diary').length}</div>
              <div className="text-sm text-gray-600">Photos Diary</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-xl">👤</span>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{getPhotosByCategory('portrait').length}</div>
              <div className="text-sm text-gray-600">Photos Portrait</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'var(--font-quicksand)'}}>
          Filtrer par catégorie
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const photoCount = category.id === 'all' ? photos.length : getPhotosByCategory(category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-yellow-400 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
                <span className="ml-2 bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs text-white">
                  {photoCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={fetchPhotos}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔄 Actualiser
        </button>
        <a
          href="/portfolio"
          target="_blank"
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Voir le portfolio public
        </a>
      </div>

      {/* Grille des photos */}
      <PhotoGrid
        photos={filteredPhotos}
        onEdit={handleEditPhoto}
        onDelete={handleDeletePhoto}
        onReorder={handleReorderPhotos}
        title={selectedCategory === 'all' 
          ? `Photos du portfolio (${filteredPhotos.length})` 
          : `Photos ${categories.find(c => c.id === selectedCategory)?.label} (${filteredPhotos.length})`
        }
      />

      {/* Modal d'édition */}
      {isEditing && selectedPhoto && (
        <PhotoEditor
          photo={selectedPhoto}
          onSave={handleUpdatePhoto}
          onCancel={() => {
            setIsEditing(false);
            setSelectedPhoto(null);
          }}
        />
      )}
    </div>
  );
}