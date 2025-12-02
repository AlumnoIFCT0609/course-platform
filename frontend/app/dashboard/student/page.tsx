// ============================================
// ARCHIVO 1: frontend/src/app/dashboard/student/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';

export default function StudentDashboard() {
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
          <h1 className="text-3xl font-bold">Dashboard de Estudiante</h1>
          <p className="mt-2">Bienvenido, {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tus Cursos</h2>
          <p className="text-gray-600">Aquí aparecerán tus cursos inscritos.</p>
        </div>
      </div>
    </div>
  );
}