// ============================================
// ARCHIVO: frontend/src/app/dashboard/admin/tutores/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import LogoutButton from '@/components/common/LogoutButton';
import UserTable from '@/components/admin/UserTable';
import UserModal from '@/components/admin/UserModal';
import { userApi } from '@/lib/api';
import { Plus, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  bio?: string;
}

export default function TutoresPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
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
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!loading) {
      loadTutors();
    }
  }, [loading, searchTerm, pagination.page]);

 const loadTutors = async () => {
  try {
    const response = await userApi.getAll({
      role: 'tutor',
      search: searchTerm || undefined,
      page: pagination.page,
      limit: pagination.limit,
    });

    console.log('Tutors response:', response); // ← DEBUG
    
    const data = response.data || response; // ← FIX
    
    setTutors(data.users || []);
    if (data.pagination) {
      setPagination(data.pagination);
    }
  } catch (error) {
    console.error('Error al cargar tutores:', error);
  }
};

  const handleCreate = () => {
    setEditingTutor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tutor: User) => {
    setEditingTutor(tutor);
    setIsModalOpen(true);
  };

  const handleDelete = async (tutorId: string) => {
    if (!confirm('¿Estás seguro de eliminar este tutor?')) return;

    try {
      await userApi.delete(tutorId);
      loadTutors();
    } catch (error) {
      console.error('Error al eliminar tutor:', error);
      alert('Error al eliminar el tutor');
    }
  };

  const handleToggleStatus = async (tutorId: string, isActive: boolean) => {
    try {
      await userApi.toggleStatus(tutorId, !isActive);
      loadTutors();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado del tutor');
    }
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    loadTutors();
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
            <h1 className="text-3xl font-bold">Gestión de Tutores</h1>
            <p className="mt-2">Administra los tutores de la plataforma</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Barra de búsqueda y botón crear */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar tutores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Tutor</span>
            </button>
          </div>

          {/* Tabla */}
          <UserTable
            users={tutors}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
        <UserModal
          user={editingTutor}
          role="tutor"
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}