'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT } from 'jose';

// Identifiants depuis les variables d'environnement
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Clé secrète pour JWT depuis les variables d'environnement
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Validation des variables d'environnement
if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !process.env.JWT_SECRET_KEY) {
  throw new Error('Variables d\'environnement manquantes: ADMIN_USERNAME, ADMIN_PASSWORD et JWT_SECRET_KEY sont requises');
}

export async function loginAction(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // Vérification des identifiants
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { error: 'Identifiants incorrects' };
  }

  try {
    // Création du token JWT
    const token = await new SignJWT({ 
      username: ADMIN_USERNAME,
      role: 'admin',
      loginTime: Date.now()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Création du cookie sécurisé
    const cookieStore = await cookies();
    cookieStore.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 heures
      path: '/'
    });

    // Retourner le succès au lieu de rediriger
    return { success: true };
    
  } catch (error) {
    console.error('Erreur lors de la création du token:', error);
    return { error: 'Erreur serveur lors de la connexion' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
  redirect('/admin/login');
}