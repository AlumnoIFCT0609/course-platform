// ============================================
// frontend/app/dashboard/tutor/cursos/[id]/page.tsx
// ============================================
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { courseApi, moduleApi, enrollmentApi, examApi } from '@/lib/api';
import { Plus, ChevronDown, ChevronRight, Users, BookOpen, Check, X, FileText } from 'lucide-react';
import ModuleModal from '@/components/tutor/ModuleModal';
import LessonModal from '@/components/tutor/LessonModal';

export default function CourseManagement() {
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'enrollments' | 'exams'>('content');
  const [exams, setExams] = useState<any[]>([]);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  useEffect(() => {
    loadCourseData();
    loadEnrollments();
    loadExams();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseRes, modulesRes] = await Promise.all([
        courseApi.getById(courseId),
        moduleApi.getByCourse(courseId),
      ]);

      setCourse(courseRes.data || courseRes);
      setModules(modulesRes.data || modulesRes);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const response = await enrollmentApi.getCourseEnrollments(courseId);
      setEnrollments(response.data || response);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  };

  const loadExams = async () => {
    try {
      const response = await examApi.getByCourse(courseId);
      setExams(response.data || response);
    } catch (error) {
      console.error('Error al cargar exámenes:', error);
    }
  };

  const handleApprove = async (enrollmentId: string) => {
    try {
      await enrollmentApi.approve(enrollmentId);
      loadEnrollments();
    } catch (error) {
      console.error('Error al aprobar:', error);
      alert('Error al aprobar la inscripción');
    }
  };

  const handleReject = async (enrollmentId: string) => {
    if (!confirm('¿Rechazar esta inscripción?')) return;
    
    try {
      await enrollmentApi.reject(enrollmentId);
      loadEnrollments();
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert('Error al rechazar la inscripción');
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

  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
  const approvedEnrollments = enrollments.filter(e => e.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">{course?.title}</h1>
          <p className="mt-2">Gestión del curso</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen size={20} />
                <span>Contenido</span>
              </button>
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'enrollments'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={20} />
                <span>Inscripciones</span>
                {pendingEnrollments.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {pendingEnrollments.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'exams'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText size={20} />
                <span>Exámenes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido según tab activa */}
        {activeTab === 'content' ? (
          <>
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
          </>
        ) : activeTab === 'enrollments' ? (
          <>
            {/* Solicitudes pendientes */}
            {pendingEnrollments.length > 0 && (
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">Solicitudes Pendientes ({pendingEnrollments.length})</h3>
                </div>
                <div className="divide-y">
                  {pendingEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{enrollment.student_name}</p>
                        <p className="text-sm text-gray-500">{enrollment.student_email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Solicitó el {new Date(enrollment.enrolled_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(enrollment.id)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                        >
                          <Check size={16} />
                          <span>Aprobar</span>
                        </button>
                        <button
                          onClick={() => handleReject(enrollment.id)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          <X size={16} />
                          <span>Rechazar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estudiantes inscritos */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">Estudiantes Inscritos ({approvedEnrollments.length})</h3>
              </div>
              {approvedEnrollments.length > 0 ? (
                <div className="divide-y">
                  {approvedEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{enrollment.student_name}</p>
                        <p className="text-sm text-gray-500">{enrollment.student_email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Progreso: {enrollment.progress_percentage || 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No hay estudiantes inscritos aún
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'exams' ? (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Exámenes del Curso</h2>
                <button
                  onClick={() => router.push(`/dashboard/tutor/cursos/${courseId}/examenes/nuevo`)}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  <Plus size={20} />
                  <span>Crear Examen</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {exams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{exam.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{exam.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      exam.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exam.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Preguntas:</span> {exam.questions_count || 0}
                    </div>
                    <div>
                      <span className="font-medium">Duración:</span> {exam.duration_minutes} min
                    </div>
                    <div>
                      <span className="font-medium">Puntuación mínima:</span> {exam.passing_score}%
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/dashboard/tutor/examenes/${exam.id}`)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                    >
                      Gestionar
                    </button>
                    {exam.status === 'draft' && (
                      <button
                        onClick={async () => {
                          try {
                            await examApi.publish(exam.id);
                            loadExams();
                          } catch (error) {
                            alert('Error al publicar examen');
                          }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Publicar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {exams.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No hay exámenes. Crea el primero.</p>
              </div>
            )}
          </>
        ) : null}
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