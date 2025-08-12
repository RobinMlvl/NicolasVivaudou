import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET - Récupérer toutes les photos publiques (sans authentification)
export async function GET() {
  try {
    const photos = await prisma.portfolioImage.findMany({
      where: {
        visible: true // Seulement les photos visibles
      },
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