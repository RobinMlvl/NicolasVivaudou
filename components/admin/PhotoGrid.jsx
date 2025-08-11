'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PhotoGrid({ photos, onEdit, onDelete, onReorder, title }) {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, photo) => {
    setDraggedItem(photo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPhoto) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetPhoto.id) return;

    const newPhotos = [...photos];
    const draggedIndex = newPhotos.findIndex(p => p.id === draggedItem.id);
    const targetIndex = newPhotos.findIndex(p => p.id === targetPhoto.id);

    // Réorganiser les photos
    const [removed] = newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(targetIndex, 0, removed);

    // Mettre à jour les positions
    const updatedPhotos = newPhotos.map((photo, index) => ({
      ...photo,
      orderPosition: index
    }));

    onReorder(updatedPhotos);
    setDraggedItem(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune photo</h3>
        <p className="text-gray-600 mb-6">Commencez par ajouter des photos à votre portfolio</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'var(--font-quicksand)'}}>
          {title || `Photos du portfolio (${photos.length})`}
        </h3>
        <div className="text-sm text-gray-600">
          Glissez-déposez pour réorganiser
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative bg-gray-100 rounded-lg overflow-hidden cursor-move transition-transform hover:scale-105"
            draggable
            onDragStart={(e) => handleDragStart(e, photo)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, photo)}
          >
            {/* Image ou Vidéo */}
            <div className="aspect-square relative">
              {photo.type === 'video' ? (
                <video
                  src={photo.imageUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                />
              ) : (
                <Image
                  src={photo.imageUrl || '/placeholder-image.jpg'}
                  alt={photo.title || 'Photo sans titre'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              )}
              
              {/* Overlay avec actions */}
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(photo);
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    title="Modifier"
                  >
                    <svg className="h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(photo.id);
                    }}
                    className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Badge de position */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>

              {/* Badge de statut et type */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {photo.type === 'video' && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    🎬 Vidéo
                  </div>
                )}
                {photo.visible === false && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Masqué
                  </div>
                )}
              </div>
            </div>

            {/* Info de la photo */}
            <div className="p-3">
              <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
                {photo.title || 'Sans titre'}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDate(photo.createdAt)}
              </p>
              {photo.description && (
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {photo.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Comment réorganiser vos photos :</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Glissez-déposez les photos pour changer leur ordre</li>
              <li>• L'ordre ici détermine l'affichage sur la page portfolio</li>
              <li>• Les changements sont sauvegardés automatiquement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}