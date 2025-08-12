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
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent" style={{fontFamily: 'var(--font-quicksand)'}}>
            Ajouter des médias
          </h3>
          <p className="text-sm text-gray-600">Images et vidéos pour votre portfolio</p>
        </div>
      </div>
      
      {/* Sélecteur de catégorie avec style premium */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Catégorie du média
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white transition-all duration-200 font-medium"
        >
          <option value="drone">🚁 Drone</option>
          <option value="diary">📖 Diary</option>
          <option value="portrait">👤 Portrait</option>
          <option value="video">🎬 Video</option>
        </select>
      </div>
      
      <div
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragging 
            ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200'
          }
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:shadow-md'}
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
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-300 shadow-sm"
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

      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50 rounded-lg">
        <div className="flex">
          <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Informations sur l'upload :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>💡 <strong>Images:</strong> Compression automatique à max 3MB et 2560px (qualité 92%)</li>
              <li>🎬 <strong>Vidéos:</strong> Upload direct sans compression pour préserver la qualité originale</li>
              <li>📊 <strong>Tailles:</strong> Images max 50MB • Vidéos max ~5GB (limite Supabase)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}