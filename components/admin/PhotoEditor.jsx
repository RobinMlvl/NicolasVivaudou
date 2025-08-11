'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PhotoEditor({ photo, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: photo.title || '',
    description: photo.description || '',
    visible: photo.visible !== false, // par défaut visible
    orderPosition: photo.orderPosition || 0,
    category: photo.category || 'drone'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...photo,
      ...formData
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'var(--font-quicksand)'}}>
              Modifier la photo
            </h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview de l'image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aperçu
              </label>
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={photo.imageUrl || '/placeholder-image.jpg'}
                  alt={formData.title || 'Photo'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                ID: {photo.id}
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la photo
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Donnez un titre à votre photo..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Décrivez cette photo..."
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="drone">🚁 Drone</option>
                    <option value="diary">📖 Diary</option>
                    <option value="portrait">👤 Portrait</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position dans la grille
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.orderPosition}
                    onChange={(e) => handleChange('orderPosition', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Plus le nombre est petit, plus la photo apparaîtra en premier
                  </p>
                </div>

                {/* Visibilité */}
                <div>
                  <div className="flex items-center">
                    <input
                      id="visible"
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) => handleChange('visible', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="visible" className="ml-2 block text-sm text-gray-700">
                      Photo visible sur le portfolio
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Décochez pour masquer cette photo du portfolio public
                  </p>
                </div>

                {/* Informations */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Informations</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p><strong>Créée le:</strong> {new Date(photo.createdAt).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Format:</strong> {photo.imageUrl ? photo.imageUrl.split('.').pop().toUpperCase() : 'N/A'}</p>
                    <p><strong>URL:</strong> <span className="font-mono break-all">{photo.imageUrl}</span></p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}