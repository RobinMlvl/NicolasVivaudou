import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET - Récupérer tous les messages de contact pour l'admin
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc' // Les plus récents en premier
      }
    });
    
    return NextResponse.json(messages);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}