import { useState, useEffect } from "react";
import { CourseCard, type CourseProps } from "@/components/shared/CourseCard";
import { supabase } from "@/lib/supabase";
import { useOutletContext, useNavigate } from "react-router-dom";
import type { StudentContextType } from "@/components/layout/StudentLayout";

type TabType = 'Todos' | 'Em Andamento' | 'Aguardando Pagamento' | 'Concluídos';

export function StudentCourses() {
    const { profile, loadingProfile } = useOutletContext<StudentContextType>();
    const navigate = useNavigate();

    const [courses, setCourses] = useState<(CourseProps & { status: string, enrollmentId?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<TabType>('Todos');

    useEffect(() => {
        if (profile) {
            fetchMyCourses();
        } else if (!loadingProfile) {
            setLoading(false);
        }
    }, [profile, loadingProfile]);

    async function fetchMyCourses() {
        if (!profile) return;
        setLoading(true);
        try {
            // Fetch enrollments
            const { data: enrollmentsData, error: enrollmentsError } = await supabase
                .from('enrollments')
                .select('id, course_id, status, enrolled_at')
                .eq('user_id', profile.id)
                .order('enrolled_at', { ascending: false });

            if (enrollmentsError) throw enrollmentsError;

            if (enrollmentsData && enrollmentsData.length > 0) {
                const courseIds = enrollmentsData.map(e => e.course_id);

                // Fetch course details
                const { data: coursesData, error: coursesError } = await supabase
                    .from('courses')
                    .select('*')
                    .in('id', courseIds);

                if (coursesError) throw coursesError;

                if (coursesData) {
                    const formatted: (CourseProps & { status: string, enrollmentId: string })[] = enrollmentsData.map(enrollment => {
                        const course = coursesData.find(c => c.id === enrollment.course_id);
                        return {
                            id: course?.id || '',
                            title: course?.title || 'Curso Desconhecido',
                            description: course?.description || "",
                            image: course?.image_url || "",
                            category: course?.category || "Geral",
                            duration: course?.duration || "0h",
                            level: course?.level || "Iniciante",
                            modules: course?.modules_count || 0,
                            price: course?.price,
                            status: enrollment.status,
                            enrollmentId: enrollment.id
                        };
                    });

                    setCourses(formatted.filter(c => c.id !== ''));
                }
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error("Erro ao carregar seus cursos:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredCourses = courses.filter(course => {
        if (filter === 'Todos') return true;
        if (filter === 'Em Andamento') return course.status === 'active';
        if (filter === 'Aguardando Pagamento') return course.status === 'pending';
        if (filter === 'Concluídos') return course.status === 'completed';
        return true;
    });

    const tabs: TabType[] = ['Todos', 'Em Andamento', 'Aguardando Pagamento', 'Concluídos'];

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Carregando seus cursos...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meus Cursos</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Gerencie seu aprendizado e acesse seus materiais.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-4 gap-2 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${filter === tab
                            ? 'bg-primary text-white shadow-md scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {tab}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${filter === tab ? 'bg-white/20' : 'bg-black/5'}`}>
                            {tab === 'Todos' ? courses.length :
                                courses.filter(c => {
                                    if (tab === 'Em Andamento') return c.status === 'active';
                                    if (tab === 'Aguardando Pagamento') return c.status === 'pending';
                                    if (tab === 'Concluídos') return c.status === 'completed';
                                    return true;
                                }).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="h-full flex flex-col">
                            <CourseCard
                                course={course}
                                variant="student"
                                // @ts-ignore
                                status={course.status}
                            />
                            {course.status === 'completed' && (
                                <button
                                    onClick={() => navigate(`/student/certificates/${course.enrollmentId}`)}
                                    className="w-full mt-3 py-2 text-primary font-bold hover:underline text-sm border border-primary/20 rounded-lg bg-primary/5 transition-colors"
                                >
                                    Abrir Certificado
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border border-dashed border-gray-200 px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Nenhum curso encontrado nesta categoria</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-[250px] sm:max-w-sm mx-auto">
                        Você ainda não possui cursos com o status "{filter}".
                    </p>
                    <button
                        onClick={() => navigate('/cursos')}
                        className="text-primary font-bold hover:underline text-sm sm:text-base"
                    >
                        Explorar novos cursos
                    </button>
                </div>
            )}
        </div>
    );
}
