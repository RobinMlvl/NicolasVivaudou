import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client public (pour le frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (pour les opérations serveur)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper pour upload d'image et vidéo
export const uploadImage = async (file, path) => {
  try {
    // Déterminer si c'est une vidéo pour optimiser le cache
    const isVideo = file.type && file.type.startsWith('video/');
    
    const { data, error } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-images')
      .upload(path, file, {
        cacheControl: isVideo ? '86400' : '3600', // Cache plus long pour les vidéos (24h vs 1h)
        upsert: false,
        contentType: file.type // Préserver le type MIME original
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur upload Supabase:', error);
    throw error;
  }
};

// Helper pour supprimer une image
export const deleteImage = async (path) => {
  try {
    const { error } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-images')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur suppression Supabase:', error);
    throw error;
  }
};

// Helper pour obtenir l'URL publique d'une image
export const getImagePublicUrl = (path) => {
  const { data } = supabaseAdmin.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-images')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

// Helper pour générer un nom de fichier unique
export const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `photos/${timestamp}-${randomString}.${extension}`;
};