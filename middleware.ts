import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode('super-secret-key-for-admin-session-2024');

async function verifyAdminSession(request: NextRequest) {
  const token = request.cookies.get('admin-session')?.value;
  
  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Vérifier si c'est une route admin (avec ou sans locale) mais exclure les API routes
  const isAdminRoute = (pathname.startsWith('/admin') || 
                       pathname.startsWith('/fr/admin') || 
                       pathname.startsWith('/en/admin')) &&
                       !pathname.startsWith('/api/');
  
  // Vérifier si c'est une API route admin
  const isAdminApiRoute = pathname.startsWith('/api/admin/');
  
  if (isAdminRoute) {
    console.log('Admin route detected:', pathname);
    
    // Autoriser la page de login
    if (pathname === '/admin/login' || 
        pathname === '/fr/admin/login' || 
        pathname === '/en/admin/login') {
      console.log('Login page - allowing access');
      return NextResponse.next();
    }

    // Vérifier la session pour les autres routes admin
    const isAuthenticated = await verifyAdminSession(request);
    console.log('Authentication status:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Not authenticated - redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    console.log('Authenticated - allowing access');
    return NextResponse.next();
  }
  
  // Protéger les API routes admin
  if (isAdminApiRoute) {
    console.log('Admin API route detected:', pathname);
    
    const isAuthenticated = await verifyAdminSession(request);
    console.log('API Authentication status:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('API Not authenticated - returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('API Authenticated - allowing access');
    return NextResponse.next();
  }

  // Exclure toutes les routes API du middleware d'internationalisation  
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Pour toutes les autres routes, utiliser le middleware d'internationalisation
  return intlMiddleware(request);
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.mp4|.*\\.webm).*)'
  ]
};