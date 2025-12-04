// ============================================
// ARCHIVO: frontend/src/app/dashboard/admin/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/common/LogoutButton';
import Sidebar from '@/components/admin/Sidebar';
import { userApi } from '@/lib/api';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTutors: 0,
    totalStudents: 0,
    activeCourses: 0,
    totalEnrollments: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (parsedUser.role !== 'admin') {
      router.push(`/dashboard/${parsedUser.role}`);
      return;
    }

    setUser(parsedUser);
    loadStats();
    setLoading(false);
  }, [router]);

  const loadStats = async () => {
    try {
      const response = await userApi.getStats();
      setStats({
        totalTutors: response.data.totalTutors,
        totalStudents: response.data.totalStudents,
        activeCourses: 0, // TODO: Implementar cuando tengas el endpoint
        totalEnrollments: 0, // TODO: Implementar cuando tengas el endpoint
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-6 relative">
          <LogoutButton />
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Dashboard de Administrador</h1>
            <p className="mt-2">
              Bienvenido, {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Tutores</h3>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.totalTutors}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Alumnos</h3>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.totalStudents}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Cursos</h3>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.activeCourses}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}