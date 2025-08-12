import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactNotification({ name, email, message, createdAt }) {
  try {
    const emailData = await resend.emails.send({
      from: 'Portfolio <noreply@nicolasvivaudou.com>',
      to: [process.env.NOTIFICATION_EMAIL || 'malaval.robin@hotmail.fr'],
      subject: `🔔 Nouveau message de contact de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; text-align: center;">📩 Nouveau Message de Contact</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Détails du message :</h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #666;">👤 Nom :</strong>
              <span style="margin-left: 10px; font-size: 16px;">${name}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #666;">📧 Email :</strong>
              <a href="mailto:${email}" style="margin-left: 10px; color: #667eea; text-decoration: none;">${email}</a>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #666;">📅 Reçu le :</strong>
              <span style="margin-left: 10px;">${new Date(createdAt).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          
          <div style="background: white; border: 1px solid #e9ecef; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin-top: 0;">💬 Message :</h3>
            <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; border-radius: 4px;">
              <p style="margin: 0; line-height: 1.6; color: #555; font-style: italic;">"${message}"</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/contact" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              👁️ Voir dans l'Admin
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Cette notification a été envoyée automatiquement depuis votre portfolio
            </p>
            <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">
              Portfolio Nicolas Vivaudou - Système de notification automatique
            </p>
          </div>
        </div>
      `,
      // Version texte pour les clients email qui ne supportent pas HTML
      text: `
Nouveau message de contact reçu !

De: ${name} <${email}>
Reçu le: ${new Date(createdAt).toLocaleDateString('fr-FR')}

Message:
"${message}"

Voir dans l'admin: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/contact
      `
    });

    console.log('✅ Email de notification envoyé:', emailData);
    return { success: true, id: emailData.data?.id || emailData.id, data: emailData };
    
  } catch (error) {
    console.error('❌ Erreur envoi email notification:', error);
    return { success: false, error: error.message };
  }
}

export async function sendContactConfirmation({ name, email }) {
  try {
    const emailData = await resend.emails.send({
      from: 'Nicolas Vivaudou <contact@nicolasvivaudou.com>',
      to: [email],
      subject: '✅ Message bien reçu - Merci pour votre contact !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; text-align: center;">✅ Message bien reçu !</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Bonjour ${name},</h2>
            <p style="line-height: 1.6; color: #555;">
              Merci pour votre message ! Je l'ai bien reçu et je vous répondrai dans les plus brefs délais.
            </p>
            <p style="line-height: 1.6; color: #555;">
              En attendant, n'hésitez pas à découvrir mon travail sur 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portfolio" style="color: #28a745; text-decoration: none;">mon portfolio</a>
              ou à me suivre sur 
              <a href="https://instagram.com/nicolasvivaudou" style="color: #28a745; text-decoration: none;">Instagram @nicolasvivaudou</a>.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              À bientôt !<br>
              Nicolas Vivaudou - Photographe
            </p>
          </div>
        </div>
      `,
      text: `
Bonjour ${name},

Merci pour votre message ! Je l'ai bien reçu et je vous répondrai dans les plus brefs délais.

En attendant, n'hésitez pas à découvrir mon travail sur mon portfolio ou à me suivre sur Instagram @nicolasvivaudou.

À bientôt !
Nicolas Vivaudou - Photographe
      `
    });

    console.log('✅ Email de confirmation envoyé:', emailData);
    return { success: true, id: emailData.data?.id || emailData.id, data: emailData };
    
  } catch (error) {
    console.error('❌ Erreur envoi email confirmation:', error);
    return { success: false, error: error.message };
  }
}