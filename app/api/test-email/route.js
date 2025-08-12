import { NextResponse } from 'next/server';
import { sendContactNotification } from '../../../lib/email';

export async function POST() {
  try {
    // Données de test
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Ceci est un test d\'envoi d\'email pour vérifier que Resend fonctionne correctement avec votre configuration.',
      createdAt: new Date()
    };

    // Envoyer l'email de test
    const result = await sendContactNotification(testData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de test envoyé avec succès !',
        emailId: result.id,
        sentTo: process.env.NOTIFICATION_EMAIL || 'malaval.robin@hotmail.fr'
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Échec de l\'envoi de l\'email de test',
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erreur test email:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors du test d\'envoi d\'email',
      error: error.message
    }, { status: 500 });
  }
}

// Version GET pour tester facilement depuis le navigateur
export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const config = {
      hasResendKey: !!process.env.RESEND_API_KEY,
      notificationEmail: process.env.NOTIFICATION_EMAIL || 'malaval.robin@hotmail.fr',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    };

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'RESEND_API_KEY manquante dans les variables d\'environnement',
        config
      }, { status: 500 });
    }

    // Données de test
    const testData = {
      name: 'Test Configuration Email',
      email: 'test-config@example.com',
      message: 'Email de test automatique pour vérifier la configuration Resend. Si vous recevez cet email, la configuration fonctionne parfaitement !',
      createdAt: new Date()
    };

    // Envoyer l'email de test
    const result = await sendContactNotification(testData);

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email de test envoyé avec succès !' : 'Échec de l\'envoi',
      emailId: result.id,
      error: result.error,
      config
    }, { status: result.success ? 200 : 500 });

  } catch (error) {
    console.error('❌ Erreur test email:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors du test d\'envoi d\'email',
      error: error.message
    }, { status: 500 });
  }
}