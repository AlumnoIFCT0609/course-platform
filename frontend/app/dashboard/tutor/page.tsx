// ============================================
// ARCHIVO 2: frontend/src/app/dashboard/tutor/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { courseApi } from '@/lib/api';
import { BookOpen, Plus, Edit2, Eye } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  status: string;
  level: string;
  durationHours?: number;
  enrolledStudents: number;
  tutorId: string; // ✅ AÑADIR ESTA LÍNEA
}

export default function TutorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'tutor') {
      router.push(`/dashboard/${parsedUser.role}`);
      return;
    }

    setUser(parsedUser);
    loadCourses();
    setLoading(false);
  }, [router]);

  const loadCourses = async () => {
    try {
      const response = await courseApi.getAll();
      const data = response.data || response;
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
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

  const myCourses = courses.filter(c => c.tutorId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Dashboard de Tutor</h1>
          <p className="mt-2">Bienvenido, {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mis Cursos</h2>
          <Link
            href="/dashboard/tutor/cursos/nuevo"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            <Plus size={20} />
            <span>Nuevo Curso</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <BookOpen className="text-emerald-600" size={32} />
                <span className={`px-2 py-1 rounded text-xs ${
                  course.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nivel: {course.level} • {course.durationHours}h
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {course.enrolledStudents} estudiantes
              </p>

              <div className="flex space-x-2">
                <Link
                  href={`/dashboard/tutor/cursos/${course.id}`}
                  className="flex-1 flex items-center justify-center space-x-1 bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700"
                >
                  <Edit2 size={16} />
                  <span>Gestionar</span>
                </Link>
                <Link
                  href={`/courses/${course.id}`}
                  className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
                >
                  <Eye size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {myCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tienes cursos creados aún</p>
          </div>
        )}
      </div>
    </div>
  );
}