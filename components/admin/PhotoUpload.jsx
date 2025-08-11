'use client';

import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

export default function PhotoUpload({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('drone');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const mediaFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (mediaFiles.length > 0) {
      uploadFiles(mediaFiles);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 3, // Taille max 3MB (au lieu de 1MB)
      maxWidthOrHeight: 2560, // Résolution max 2560px (au lieu de 1920px)
      useWebWorker: true,
      quality: 0.92 // Qualité 92% (au lieu de 80%)
    };
    
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Erreur compression:', error);
      return file; // Retourner le fichier original si compression échoue
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    setUploadSuccess('');
    setUploadMessage(`Upload de ${files.length} fichier(s) en cours...`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const originalFile = files[i];
      
      try {
        let fileToUpload = originalFile;
        
        // Compresser seulement les images
        if (originalFile.type.startsWith('image/')) {
          setUploadMessage(`Compression de l'image ${originalFile.name}...`);
          console.log(`Compression image ${originalFile.name}: ${(originalFile.size / 1024 / 1024).toFixed(2)}MB`);
          fileToUpload = await compressImage(originalFile);
          console.log(`Après compression image: ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
        } else if (originalFile.type.startsWith('video/')) {
          const sizeMB = originalFile.size / (1024 * 1024);
          setUploadMessage(`Upload vidéo ${originalFile.name} (${sizeMB.toFixed(1)}MB)...`);
          console.log(`Upload vidéo original ${originalFile.name}: ${sizeMB.toFixed(2)}MB`);
          // Pas de compression pour les vidéos - upload direct
        }
        
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('title', originalFile.name.split('.')[0]);
        formData.append('category', selectedCategory);

        const response = await fetch('/api/admin/portfolio/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const newPhoto = await response.json();
          onUploadComplete(newPhoto);
          successCount++;
        } else {
          const errorData = await response.json();
          let errorMessage = errorData.error || 'Erreur inconnue';
          
          // Messages d'erreur spécifiques
          if (errorMessage.includes('exceeded the maximum allowed size')) {
            errorMessage = `Fichier trop volumineux (limite Supabase: ~5GB). Essayez de compresser la vidéo.`;
          } else if (errorMessage.includes('Invalid file type')) {
            errorMessage = `Format non supporté. Utilisez MP4, MOV, AVI ou WEBM.`;
          }
          
          errors.push(`${originalFile.name}: ${errorMessage}`);
          errorCount++;
        }

        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        errors.push(`${originalFile.name}: ${error.message || 'Erreur de connexion'}`);
        errorCount++;
        setUploadProgress(((i + 1) / files.length) * 100);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setUploadMessage('');

    // Messages finaux
    if (successCount > 0) {
      setUploadSuccess(`✅ ${successCount} fichier(s) uploadé(s) avec succès !`);
    }
    
    if (errorCount > 0) {
      setUploadError(`❌ ${errorCount} erreur(s) :\n${errors.join('\n')}`);
    }

    // Effacer les messages après 5 secondes
    setTimeout(() => {
      setUploadSuccess('');
      setUploadError('');
    }, 5000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'var(--font-quicksand)'}}>
        Ajouter des photos
      </h3>
      
      {/* Sélecteur de catégorie */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="drone">🚁 Drone</option>
          <option value="diary">📖 Diary</option>
          <option value="portrait">👤 Portrait</option>
          <option value="video">🎬 Video</option>
        </select>
      </div>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && document.getElementById('fileInput').click()}
      >
        {uploading ? (
          <div>
            <svg className="mx-auto h-12 w-12 text-blue-400 mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-gray-600 mb-2">
              {uploadMessage || 'Upload en cours...'}
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload: {Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragging ? 'Déposez vos images ici' : 'Ajoutez vos photos'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Glissez-déposez vos images/vidéos ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500">
              Images: JPG, PNG, WEBP, GIF (max 50MB) • Vidéos: MP4, MOV, AVI, WEBM (max ~5GB)
            </p>
          </div>
        )}

        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Messages de succès et d'erreur */}
      {uploadSuccess && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 whitespace-pre-line">{uploadSuccess}</p>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 whitespace-pre-line">{uploadError}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 <strong>Images:</strong> Compression automatique à max 3MB et 2560px (qualité 92%).</p>
        <p>🎬 <strong>Vidéos:</strong> Upload direct sans compression pour préserver la qualité originale.</p>
        <p>📊 <strong>Tailles:</strong> Images max 50MB • Vidéos max ~5GB (limite Supabase).</p>
      </div>
    </div>
  );
}