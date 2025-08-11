import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET - Récupérer toutes les photos
export async function GET() {
  try {
    const photos = await prisma.portfolioImage.findMany({
      orderBy: {
        orderPosition: 'asc'
      }
    });
    
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des photos' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une nouvelle photo
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Créer la nouvelle photo avec Prisma
    const newPhoto = await prisma.portfolioImage.create({
      data: {
        title: body.title || 'Sans titre',
        description: body.description || '',
        imageUrl: body.imageUrl || '',
        imagePath: body.imagePath || '',
        orderPosition: body.orderPosition || 0,
        visible: body.visible !== false,
        type: body.type || 'image',
        category: body.category || 'drone',
        fileSize: body.fileSize,
        fileName: body.fileName,
        mimeType: body.mimeType
      }
    });
    
    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de la photo' },
      { status: 500 }
    );
  }
}