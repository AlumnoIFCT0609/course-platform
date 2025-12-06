
// ============================================
// ARCHIVO 5: frontend/app/page.tsx
// ============================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un token
    //const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (user) {
      const userData = JSON.parse(user);
      // Redirigir según el rol
      router.push(`/dashboard/${userData.role}`);
    } else {
      // Redirigir al login
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}
