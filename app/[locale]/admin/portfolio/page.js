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
    <div className="space-y-8">
      {/* Header avec style premium */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 sm:p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent" style={{fontFamily: 'var(--font-quicksand)'}}>
              Gestion du Portfolio
            </h1>
            <p className="text-gray-600 mt-1">
              Ajoutez, modifiez et organisez vos médias de portfolio
            </p>
          </div>
        </div>
        
        {/* Stats rapides dans le header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-lg">
            <div className="text-lg font-bold text-yellow-700">{photos.length}</div>
            <div className="text-xs text-yellow-600">Total</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{photos.filter(p => p.visible !== false).length}</div>
            <div className="text-xs text-green-600">Visibles</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{photos.filter(p => p.type === 'image').length}</div>
            <div className="text-xs text-blue-600">Images</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{photos.filter(p => p.type === 'video').length}</div>
            <div className="text-xs text-purple-600">Vidéos</div>
          </div>
        </div>
      </div>

      {/* Zone d'upload avec style premium */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
        <PhotoUpload onUploadComplete={handleUploadComplete} />
      </div>

      {/* Filtres catégories avec style moderne */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'var(--font-quicksand)'}}>
          Filtrer par catégorie
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/25'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span className="text-sm">{category.icon}</span>
              <span className="text-sm">{category.label}</span>
              <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs text-white">
                {category.id === 'all' ? photos.length : photos.filter(p => p.category === category.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions rapides avec style premium */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={fetchPhotos}
            className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-lg transition-all duration-200 font-medium shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
          <a
            href="/portfolio"
            target="_blank"
            className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 8l6-6m0 0H16m4 0v4M10 14l6-6" />
            </svg>
            Voir le portfolio public
          </a>
        </div>
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