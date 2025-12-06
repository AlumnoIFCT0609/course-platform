// ============================================
// ARCHIVO: frontend/src/app/dashboard/admin/cursos/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import LogoutButton from '@/components/common/LogoutButton';
import CourseTable from '@/components/admin/CourseTable';
import CourseModal from '@/components/admin/CourseModal';
import { courseApi, userApi } from '@/lib/api';
import { Plus, Search, Filter } from 'lucide-react';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  tutorId: string;
  tutorName?: string;
  status: 'draft' | 'published' | 'archived';
  contentType: 'video' | 'document' | 'mixed';
  level: string;
  durationHours?: number;
  maxStudents?: number;  // ← Añade esto
  language?: string;      // ← Añade esto
  createdAt: string;
}

export default function CursosPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
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
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!loading) {
      loadCourses();
      loadTutors();
    }
  }, [loading, searchTerm, statusFilter, pagination.page]);

 const loadCourses = async () => {
  try {
    const response = await courseApi.getAll({
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      page: pagination.page,
      limit: pagination.limit,
    });

    console.log('Courses response:', response); // ← DEBUG
    
    const data = response.data || response;
    
    setCourses(data.courses || data || []);
    if (data.pagination) {
      setPagination(data.pagination);
    }
  } catch (error) {
    console.error('Error al cargar cursos:', error);
  }
};

  const loadTutors = async () => {
  try {
    const response = await userApi.getAll({
      role: 'tutor',
      limit: 100,
    });
    
    console.log('Tutors for dropdown:', response); // ← DEBUG
    
    const data = response.data || response;
    setTutors(data.users || []);
  } catch (error) {
    console.error('Error al cargar tutores:', error);
  }
};

  const handleToggleStatus = async (courseId: string, currentStatus: string) => {
  // Solo cambia entre draft y archived
  const newStatus = currentStatus === 'archived' ? 'draft' : 'archived';

  try {
    await courseApi.toggleStatus(courseId, newStatus);
    loadCourses();
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    alert('Error al cambiar el estado del curso');
  }
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (course: Course) => {  // ← Cambiar a Course
  setCourseToDelete(course);  // ← Guardar el curso
  setIsDeleteModalOpen(true); // ← Abrir modal
};

const confirmDelete = async (hardDelete: boolean) => {  // ← Nueva función
  if (!courseToDelete) return;

  try {
    await courseApi.delete(courseToDelete.id, hardDelete);
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);

    await loadCourses();
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    alert('Error al eliminar el curso');
  }
};

  const handlePublish = async (courseId: string) => {
    try {
      await courseApi.publish(courseId);
      loadCourses();
    } catch (error) {
      console.error('Error al publicar curso:', error);
      alert('Error al publicar el curso');
    }
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    loadCourses();
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
      <Sidebar />

      <div className="flex-1">
        <div className="bg-emerald-700 text-white p-6 relative">
          <LogoutButton />
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
            <p className="mt-2">Administra los cursos de la plataforma</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Barra de búsqueda y filtros */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-1 gap-4 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Todos los estados</option>
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Nuevo Curso</span>
            </button>
          </div>

          {/* Tabla */}
          <CourseTable
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onToggleStatus={handleToggleStatus}
          />

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CourseModal
          course={editingCourse}
          tutors={tutors}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {/* Modal de confirmación */}
{isDeleteModalOpen && (
  <DeleteConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => {
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    }}
    onConfirm={confirmDelete}
    itemType="curso"
    itemName={courseToDelete?.title || ''}
  />
)}
    </div>
  );
}