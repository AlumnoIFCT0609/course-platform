// ============================================
// ARCHIVO 3: frontend/src/app/dashboard/admin/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-700 text-white p-6">
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