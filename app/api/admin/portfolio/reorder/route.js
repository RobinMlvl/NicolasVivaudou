import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// POST - Réorganiser les photos
export async function POST(request) {
  try {
    const body = await request.json();
    const { photos } = body;
    
    if (!Array.isArray(photos)) {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      );
    }
    
    // Mettre à jour les positions en utilisant une transaction
    const updatePromises = photos.map((photo, index) =>
      prisma.portfolioImage.update({
        where: { id: photo.id },
        data: { orderPosition: index }
      })
    );
    
    // Exécuter toutes les mises à jour en parallèle
    const updatedPhotos = await Promise.all(updatePromises);
    
    return NextResponse.json({ 
      message: 'Ordre des photos mis à jour',
      photos: updatedPhotos 
    });
  } catch (error) {
    console.error('Erreur lors de la réorganisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réorganisation' },
      { status: 500 }
    );
  }
}