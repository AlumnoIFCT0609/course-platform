// ============================================
// frontend/app/dashboard/tutor/cursos/[id]/page.tsx
// ============================================


'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { courseApi, moduleApi, lessonApi } from '@/lib/api';
import { Plus, ChevronDown, ChevronRight, Video, FileText } from 'lucide-react';
import ModuleModal from '@/components/tutor/ModuleModal';
import LessonModal from '@/components/tutor/LessonModal';

export default function CourseManagement() {
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

 const loadCourseData = async () => {
  try {
    const [courseRes, modulesRes] = await Promise.all([
      courseApi.getById(courseId),
      moduleApi.getByCourse(courseId),
    ]);

    setCourse(courseRes.data || courseRes);
    
    // Cargar lecciones de cada módulo
    const modulesData = modulesRes.data || modulesRes;
    const modulesWithLessons = await Promise.all(
      modulesData.map(async (module: any) => {
        try {
            
          // Aquí necesitarías un endpoint para obtener lecciones por módulo
          // Por ahora dejamos el módulo sin lecciones cargadas

          return { ...module, lessons: [] };
        } catch {
          return { ...module, lessons: [] };
        }
      })
    );

    setModules(modulesWithLessons);
    setLoading(false);
  } catch (error) {
    console.error('Error:', error);
    setLoading(false);
  }
};

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleAddLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setIsLessonModalOpen(true);
  };

  if (loading) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">{course?.title}</h1>
          <p className="mt-2">Gestión de contenido del curso</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Módulos y Lecciones</h2>
            <button
              onClick={() => setIsModuleModalOpen(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              <Plus size={20} />
              <span>Añadir Módulo</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="bg-white rounded-lg shadow">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center space-x-3">
                  {expandedModules.has(module.id) ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                  <span className="font-semibold">
                    Módulo {index + 1}: {module.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddLesson(module.id);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 text-sm"
                >
                  + Añadir Lección
                </button>
              </div>

              {expandedModules.has(module.id) && (
                <div className="border-t p-4 bg-gray-50">
                  {module.lessons?.length > 0 ? (
                    <div className="space-y-2">
                      {module.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center space-x-3 p-3 bg-white rounded">
                          <Video size={16} className="text-gray-400" />
                          <span>{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay lecciones en este módulo</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No hay módulos. Añade el primero.</p>
          </div>
        )}
      </div>

      {/* Modales */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        courseId={courseId}
        onClose={() => setIsModuleModalOpen(false)}
        onSuccess={loadCourseData}
      />

      <LessonModal
        isOpen={isLessonModalOpen}
        moduleId={selectedModuleId || ''}
        onClose={() => {
          setIsLessonModalOpen(false);
          setSelectedModuleId(null);
        }}
        onSuccess={loadCourseData}
      />

    </div>
  );
}