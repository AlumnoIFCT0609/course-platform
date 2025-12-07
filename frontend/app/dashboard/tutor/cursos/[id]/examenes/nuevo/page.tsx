// ============================================
// frontend/app/dashboard/tutor/cursos/[id]/examenes/nuevo/page.tsx
// ============================================


'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { examApi } from '@/lib/api';

export default function NewExam() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    passingScore: 70,
    maxAttempts: 1,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await examApi.create(courseId, formData);
      const exam = response.data || response;
      router.push(`/dashboard/tutor/examenes/${exam.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear examen');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Crear Nuevo Examen</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duración (min)</label>
              <input
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nota mínima (%)</label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Intentos máx.</label>
              <input
                type="number"
                value={formData.maxAttempts}
                onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Examen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}