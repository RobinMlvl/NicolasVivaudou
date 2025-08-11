import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { uploadImage, generateUniqueFileName, getImagePublicUrl } from '../../../../../lib/supabase';

// POST - Upload d'une nouvelle photo
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') || 'Sans titre';
    const description = formData.get('description') || '';
    const category = formData.get('category') || 'drone';
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    // Validation du type de fichier
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/avi', 'video/webm'];
    const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    
    if (!allAllowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Formats acceptés: Images (JPG, PNG, WEBP, GIF) ou Vidéos (MP4, MOV, AVI, WEBM)' },
        { status: 400 }
      );
    }

    // Déterminer le type de média
    const isVideo = allowedVideoTypes.includes(file.type);
    const mediaType = isVideo ? 'video' : 'image';
    
    // Validation de la taille (50MB max pour images seulement)
    if (!isVideo) {
      const maxImageSize = 50 * 1024 * 1024;
      if (file.size > maxImageSize) {
        return NextResponse.json(
          { error: `Image trop volumineuse (max 50MB pour les images)` },
          { status: 400 }
        );
      }
    }
    
    // Vérifier que Supabase est configuré
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante. Veuillez configurer SUPABASE_SERVICE_ROLE_KEY et NEXT_PUBLIC_SUPABASE_URL' },
        { status: 500 }
      );
    }
    
    // Générer un nom de fichier unique
    const uniqueFileName = generateUniqueFileName(file.name);
    
    // Convertir le fichier en ArrayBuffer puis en Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload vers Supabase Storage
    await uploadImage(buffer, uniqueFileName);
    
    // Obtenir l'URL publique
    const publicUrl = getImagePublicUrl(uniqueFileName);
    
    // Calculer automatiquement la prochaine position
    const lastPhoto = await prisma.portfolioImage.findFirst({
      orderBy: { orderPosition: 'desc' }
    });
    const nextPosition = lastPhoto ? lastPhoto.orderPosition + 1 : 0;
    
    // Créer la nouvelle photo dans la base de données
    const newPhoto = await prisma.portfolioImage.create({
      data: {
        title: title,
        description: description,
        imageUrl: publicUrl,
        imagePath: uniqueFileName,
        orderPosition: nextPosition,
        visible: true,
        type: mediaType,
        category: category,
        fileSize: file.size.toString(),
        fileName: file.name,
        mimeType: file.type
      }
    });
    
    return NextResponse.json(newPhoto, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload: ' + error.message },
      { status: 500 }
    );
  }
}