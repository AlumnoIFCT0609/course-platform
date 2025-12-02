// ============================================
// ARCHIVO 3: frontend/src/app/dashboard/admin/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/common/LogoutButton';

export default function AdminDashboard() {
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // ***
  const router = useRouter();
  
  useEffect(() => {
    
    const userData = localStorage.getItem('user');

    if (!userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role !== 'admin') {
      // Si no es admin, redirige a su dashboard correspondiente
      router.push(`/dashboard/${parsedUser.role}`);
      return;
    }

    setUser(parsedUser);
      setLoading(false); // ✅ Validación completa ***

  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-emerald-700 text-white p-6 relative">
        {/* Botón salir arriba a la derecha */}
        <LogoutButton />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Dashboard de Administrador</h1>
          <p className="mt-2">Bienvenido, {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
            <p className="text-3xl font-bold text-emerald-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Cursos</h3>
            <p className="text-3xl font-bold text-emerald-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Inscripciones</h3>
            <p className="text-3xl font-bold text-emerald-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}