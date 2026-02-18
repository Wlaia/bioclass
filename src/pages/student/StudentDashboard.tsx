import { CourseCard, type CourseProps } from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { StudentContextType } from "@/components/layout/StudentLayout";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProfileForm } from "@/components/student/ProfileForm";

export function StudentDashboard() {
    const navigate = useNavigate();
    const { profile, refreshProfile, loadingProfile } = useOutletContext<StudentContextType>();

    // Extended state to include status
    const [myCourses, setMyCourses] = useState<(CourseProps & { status: string })[]>([]);
    const [availableCourses, setAvailableCourses] = useState<CourseProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
    const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);

    // Featured course (the most recent one enrolled)
    const featuredCourse = myCourses.length > 0 ? myCourses[0] : null;

    useEffect(() => {
        fetchCoursesAndEnrollments();
    }, [profile]);

    async function fetchCoursesAndEnrollments() {
        if (!profile && !loadingProfile) {
            // Wait for profile
        }

        try {
            // 1. Fetch all courses
            const { data: coursesData, error: coursesError } = await supabase
                .from('courses')
                .select('*');

            if (coursesError) throw coursesError;

            // 2. Fetch my enrollments with status
            let enrollmentMap = new Map<string, string>(); // course_id -> status

            if (profile) {
                const { data: enrollmentsData, error: enrollmentsError } = await supabase
                    .from('enrollments')
                    .select('course_id, status, enrolled_at')
                    .eq('user_id', profile.id)
                    .order('enrolled_at', { ascending: false }); // Get most recent first

                if (enrollmentsError) {
                    console.error("Error fetching enrollments:", enrollmentsError);
                } else if (enrollmentsData) {
                    enrollmentsData.forEach(e => {
                        enrollmentMap.set(e.course_id, e.status);
                    });
                }
            }

            if (coursesData) {
                const formattedCourses: CourseProps[] = coursesData.map(course => ({
                    id: course.id,
                    title: course.title,
                    description: course.description || "",
                    image: course.image_url || "",
                    category: course.category || "Geral",
                    duration: course.duration || "0h",
                    level: course.level || "Iniciante",
                    modules: course.modules_count || 0
                }));

                const my = formattedCourses
                    .filter(c => enrollmentMap.has(c.id))
                    .map(c => ({ ...c, status: enrollmentMap.get(c.id)! }));

                // Sort my courses to match the enrollment order (most recent first)
                // Since enrollmentMap iteration order is insertion order (which came from sorted query),
                // the filter/map might not preserve it perfectly if we iterate over 'coursesData'.
                // So let's re-sort 'my' based on the enrollment list if needed, or better yet:
                // We can't easily resort without the enrollment list handy.
                // Let's rely on the fact that we should probably just find the "featured" one 
                // by looking at the first enrollment from the DB query.

                // Better approach for sorting:
                if (profile) {
                    const { data: enrollmentsData } = await supabase
                        .from('enrollments')
                        .select('course_id')
                        .eq('user_id', profile.id)
                        .order('enrolled_at', { ascending: false });

                    if (enrollmentsData) {
                        const sortedMyCourses = enrollmentsData
                            .map(e => my.find(c => c.id === e.course_id))
                            .filter(c => c !== undefined) as (CourseProps & { status: string })[];
                        setMyCourses(sortedMyCourses);
                    } else {
                        setMyCourses(my);
                    }
                } else {
                    setMyCourses(my);
                }

                const available = formattedCourses.filter(c => !enrollmentMap.has(c.id));
                setAvailableCourses(available);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    }

    const isProfileComplete = (p: typeof profile) => {
        if (!p) return false;
        return p.full_name && p.cpf && p.phone && p.address && p.city && p.state && p.zip_code;
    };

    const executeEnrollment = async (courseId: string) => {
        if (!profile) return;

        try {
            const { error } = await supabase
                .from('enrollments')
                .insert({
                    user_id: profile.id,
                    course_id: courseId,
                    status: 'pending'
                });

            if (error) throw error;

            navigate("/student/payment");
        } catch (error) {
            console.error("Error enrolling:", error);
            alert("Erro ao realizar inscrição. Tente novamente.");
        }
    };

    const handleEnrollClick = (courseId: string) => {
        setPendingCourseId(courseId);

        if (isProfileComplete(profile)) {
            executeEnrollment(courseId);
        } else {
            setProfileDialogOpen(true);
        }
    };

    const handleProfileSuccess = async () => {
        await refreshProfile();
        setProfileDialogOpen(false);
        if (pendingCourseId) {
            executeEnrollment(pendingCourseId);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Olá, {profile?.full_name?.split(' ')[0] || "Aluno"} 👋</h1>
                    <p className="text-gray-500">Continue de onde você parou.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <Award className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Certificados</p>
                            <p className="text-sm font-bold text-gray-900">0 Conquistados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Course Hero (Dynamic) */}
            {featuredCourse && (
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 text-white shadow-xl group cursor-pointer">
                    <div className="absolute inset-0">
                        <img
                            src={featuredCourse.image}
                            alt={featuredCourse.title}
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                    </div>

                    <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div className="space-y-4 max-w-xl">
                            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium">
                                <TrendingUp className="w-4 h-4" />
                                <span>
                                    {featuredCourse.status === 'active' ? 'Em andamento' :
                                        featuredCourse.status === 'completed' ? 'Concluído' : 'Aguardando Confirmação'}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">{featuredCourse.title}</h2>
                            <p className="text-lg text-gray-300">{featuredCourse.modules} Módulos • {featuredCourse.duration}</p>

                        </div>

                        <div className="shrink-0">
                            {featuredCourse.status === 'active' && (
                                <Button size="lg" className="rounded-full h-12 px-8 bg-white text-gray-900 hover:bg-gray-100 hover:text-primary font-bold shadow-2xl transition-all">
                                    <PlayCircle className="w-5 h-5 mr-2 fill-current" />
                                    Acessar Materiais
                                </Button>
                            )}
                            {featuredCourse.status === 'pending' && (
                                <Button size="lg" className="rounded-full h-12 px-8 bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-bold shadow-2xl transition-all" onClick={() => navigate('/student/payment')}>
                                    Confirmar Pagamento
                                </Button>
                            )}
                            {featuredCourse.status === 'completed' && (
                                <Button size="lg" className="rounded-full h-12 px-8 bg-blue-500 text-white hover:bg-blue-600 font-bold shadow-2xl transition-all">
                                    <Award className="w-5 h-5 mr-2" />
                                    Ver Certificado
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* My Courses */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Meus Cursos</h2>
                    <Button variant="link" className="text-primary">Ver todos</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="col-span-3 text-center text-gray-500 py-12">Carregando seus cursos...</p>
                    ) : myCourses.length > 0 ? (
                        myCourses.map(course => (
                            <div key={course.id} className="h-full">
                                <CourseCard
                                    course={course}
                                    variant="student"
                                    // @ts-ignore
                                    status={course.status}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Você ainda não está matriculado em nenhum curso.</p>
                            <Button variant="outline" className="mt-4" onClick={() => document.getElementById('available-courses')?.scrollIntoView({ behavior: 'smooth' })}>Ver Cursos Disponíveis</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Available Courses */}
            <div id="available-courses">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Cursos Disponíveis</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="col-span-3 text-center text-gray-500 py-12">Carregando cursos disponíveis...</p>
                    ) : availableCourses.length > 0 ? (
                        availableCourses.map(course => (
                            <div key={course.id} className="h-full">
                                <CourseCard
                                    course={course}
                                    variant="enroll"
                                    onEnroll={() => handleEnrollClick(course.id)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Nenhum curso novo disponível no momento.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Logic Dialog */}
            <Dialog open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Complete seu Cadastro</DialogTitle>
                        <DialogDescription>
                            Para realizar a matrícula, precisamos de algumas informações adicionais.
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm
                        initialData={profile || {}}
                        onSuccess={handleProfileSuccess}
                        onCancel={() => setProfileDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
