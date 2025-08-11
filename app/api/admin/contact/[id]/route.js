import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// PUT - Mettre à jour un message (marquer comme lu/non lu)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { read } = await request.json();
    
    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'Le statut "read" doit être un booléen' },
        { status: 400 }
      );
    }
    
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { read }
    });
    
    return NextResponse.json(updatedMessage);
    
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }
    
    console.error('Erreur lors de la mise à jour du message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du message' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un message
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.contactMessage.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }
    
    console.error('Erreur lors de la suppression du message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du message' },
      { status: 500 }
    );
  }
}