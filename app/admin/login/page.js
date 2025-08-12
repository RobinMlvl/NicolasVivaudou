import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LoginForm from './LoginForm';

async function checkSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  
  if (session) {
    redirect('/fr/admin/portfolio');
  }
}

export default async function AdminLoginPage() {
  await checkSession();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Administration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connexion requise pour accéder au panel admin
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}