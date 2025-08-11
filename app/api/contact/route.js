import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { sendContactNotification, sendContactConfirmation } from '../../../lib/email';

// POST - Soumettre un nouveau message de contact
export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    
    // Validation des données requises
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis (nom, email, message)' },
        { status: 400 }
      );
    }
    
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }
    
    // Validation de la longueur
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Le nom ne peut pas dépasser 100 caractères' },
        { status: 400 }
      );
    }
    
    if (email.length > 255) {
      return NextResponse.json(
        { error: 'L\'email ne peut pas dépasser 255 caractères' },
        { status: 400 }
      );
    }
    
    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Le message ne peut pas dépasser 5000 caractères' },
        { status: 400 }
      );
    }
    
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Le message doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }
    
    // Créer le nouveau message de contact
    const newMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      }
    });
    
    // Envoyer les notifications email (ne pas bloquer la réponse si ça échoue)
    Promise.all([
      // Email de notification à l'admin
      sendContactNotification({
        name: newMessage.name,
        email: newMessage.email,
        message: newMessage.message,
        createdAt: newMessage.createdAt
      }),
      // Email de confirmation au visiteur
      sendContactConfirmation({
        name: newMessage.name,
        email: newMessage.email
      })
    ]).then(([notificationResult, confirmationResult]) => {
      console.log('📧 Résultats envoi emails:');
      console.log('- Notification admin:', notificationResult.success ? '✅' : '❌', notificationResult.error || '');
      console.log('- Confirmation visiteur:', confirmationResult.success ? '✅' : '❌', confirmationResult.error || '');
    }).catch(error => {
      console.error('❌ Erreur envoi emails:', error);
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Votre message a été envoyé avec succès !',
        id: newMessage.id 
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}