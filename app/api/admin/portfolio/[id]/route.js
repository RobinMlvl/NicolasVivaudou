import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { deleteImage } from '../../../../../lib/supabase';

// GET - Récupérer une photo par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const photo = await prisma.portfolioImage.findUnique({
      where: { id }
    });
    
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(photo);
  } catch (error) {
    console.error('Erreur lors de la récupération de la photo:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une photo
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Vérifier si la photo existe
    const existingPhoto = await prisma.portfolioImage.findUnique({
      where: { id }
    });
    
    if (!existingPhoto) {
      return NextResponse.json(
        { error: 'Photo non trouvée' },
        { status: 404 }
      );
    }
    
    // Mettre à jour la photo avec Prisma
    const updatedPhoto = await prisma.portfolioImage.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        orderPosition: body.orderPosition,
        visible: body.visible,
        type: body.type,
        category: body.category,
        // updatedAt est automatiquement mis à jour par Prisma
      }
    });
    
    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une photo
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Récupérer la photo pour obtenir le chemin de l'image
    const photo = await prisma.portfolioImage.findUnique({
      where: { id }
    });
    
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer l'image de Supabase Storage si elle existe
    if (photo.imagePath && !photo.imagePath.startsWith('/portfolio-home/')) {
      try {
        await deleteImage(photo.imagePath);
      } catch (error) {
        console.warn('Erreur lors de la suppression du fichier:', error);
      }
    }
    
    // Supprimer la photo de la base de données
    await prisma.portfolioImage.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      message: 'Photo supprimée avec succès',
      deletedPhoto: photo 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}