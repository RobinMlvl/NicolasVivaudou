'use client';

import { useCallback } from 'react';

export const useVideoCompression = () => {
  
  const compressVideoMediaRecorder = useCallback(async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true; // Important pour éviter les erreurs autoplay
      
      video.onloadedmetadata = () => {
        try {
          // Créer un MediaRecorder à partir du fichier video
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Déterminer la résolution de sortie (réduction si nécessaire)
          const originalWidth = video.videoWidth;
          const originalHeight = video.videoHeight;
          
          // Réduire la résolution seulement si vraiment nécessaire (max 1920x1080)
          let targetWidth = originalWidth;
          let targetHeight = originalHeight;
          
          if (originalWidth > 1920) {
            targetWidth = 1920;
            targetHeight = Math.round((originalHeight * 1920) / originalWidth);
          }
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          // Configuration MediaRecorder pour préserver la qualité
          const stream = canvas.captureStream(30); // 30 FPS pour fluidité
          
          // Essayer les meilleurs codecs avec bitrate élevé
          let mimeType = 'video/webm;codecs=vp9';
          let videoBitsPerSecond = 5000000; // 5 Mbps pour haute qualité
          
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp8';
            videoBitsPerSecond = 4000000; // 4 Mbps fallback VP8
          }
          
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
            videoBitsPerSecond = 3500000; // 3.5 Mbps fallback générique
          }
          
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond
          });
          
          const chunks = [];
          let frameCount = 0;
          const fps = 30; // Correspondre au captureStream
          const totalFrames = Math.ceil(video.duration * fps);
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };
          
          mediaRecorder.onstop = () => {
            const compressedBlob = new Blob(chunks, { type: mimeType.split(';')[0] });
            const fileExtension = mimeType.includes('webm') ? '.webm' : '.mp4';
            const compressedFile = new File([compressedBlob], 
              file.name.replace(/\.[^/.]+$/, fileExtension), {
              type: compressedBlob.type,
              lastModified: Date.now(),
            });
            URL.revokeObjectURL(video.src);
            resolve(compressedFile);
          };
          
          mediaRecorder.onerror = (event) => {
            reject(new Error('Erreur MediaRecorder: ' + event.error?.message));
          };
          
          // Fonction pour dessiner les frames
          const processFrame = () => {
            if (frameCount >= totalFrames) {
              mediaRecorder.stop();
              return;
            }
            
            const currentTime = frameCount / fps;
            video.currentTime = currentTime;
            
            video.onseeked = () => {
              // Dessiner la frame actuelle sur le canvas
              ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
              
              frameCount++;
              const progress = Math.round((frameCount / totalFrames) * 100);
              onProgress?.(Math.min(progress, 99));
              
              // Délai pour permettre au MediaRecorder de capturer la frame
              setTimeout(processFrame, 1000 / fps);
            };
          };
          
          // Démarrer l'enregistrement
          mediaRecorder.start(100); // Collecte des chunks toutes les 100ms
          processFrame();
          
        } catch (error) {
          reject(new Error('Erreur configuration compression: ' + error.message));
        }
      };
      
      video.onerror = () => {
        reject(new Error('Erreur lors du chargement de la vidéo'));
      };
      
      video.src = URL.createObjectURL(file);
      video.load();
    });
  }, []);

  const compressVideo = useCallback(async (file, onProgress) => {
    try {
      // Vérifier la compatibilité MediaRecorder
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder non supporté par ce navigateur');
      }
      
      const compressedFile = await compressVideoMediaRecorder(file, onProgress);
      onProgress?.(100);
      return compressedFile;
    } catch (error) {
      console.error('Erreur compression vidéo:', error);
      // En cas d'erreur, proposer de réduire simplement la qualité sans compression complète
      throw new Error('Compression vidéo échouée: ' + error.message);
    }
  }, [compressVideoMediaRecorder]);

  const getCompressionEstimate = useCallback((file) => {
    const sizeMB = file.size / (1024 * 1024);
    
    if (sizeMB < 30) {
      return { estimatedReduction: '15-30%', shouldCompress: false };
    } else if (sizeMB < 100) {
      return { estimatedReduction: '25-45%', shouldCompress: true };
    } else {
      return { estimatedReduction: '35-60%', shouldCompress: true };
    }
  }, []);

  return {
    compressVideo,
    getCompressionEstimate
  };
};