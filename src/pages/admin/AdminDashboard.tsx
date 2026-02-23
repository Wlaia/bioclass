import { useEffect, useState } from "react";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AdminDashboard() {
    const [stats, setStats] = useState({
        studentsCount: 0,
        coursesCount: 0,
        enrollmentsCount: 0,
        revenue: 0
    });

    const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);
    const [popularCourses, setPopularCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            // Count registered users
            const { count: studentsCount, error: err1 } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Count active courses
            const { count: coursesCount, error: err2 } = await supabase
                .from('courses')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            // Count completed/total enrollments (approximations for revenue/certs)
            const { data: enrollments, error: err3 } = await supabase
                .from('enrollments')
                .select('status, enrolled_at, courses ( title, price ), profiles ( full_name )')
                .order('enrolled_at', { ascending: false });

            if (err1 || err2 || err3) throw new Error("Erro ao buscar dados do dashboard");

            const activeEnrollments = enrollments?.filter(e => e.status !== 'cancelled') || [];

            // Calculate a dummy revenue based on course prices
            const estimatedRevenue = activeEnrollments.reduce((acc, curr) => {
                const courseData = curr.courses as any;
                const price = courseData?.price || 0;
                return acc + price;
            }, 0);

            // Compute recent enrollments
            setRecentEnrollments((enrollments || []).slice(0, 5));

            // Compute popular courses
            const courseTally: Record<string, number> = {};
            activeEnrollments.forEach(e => {
                const courseData = e.courses as any;
                const title = courseData?.title;
                if (title) {
                    courseTally[title] = (courseTally[title] || 0) + 1;
                }
            });

            const sortedPopular = Object.entries(courseTally)
                .map(([title, count]) => ({ title, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            setPopularCourses(sortedPopular);

            setStats({
                studentsCount: studentsCount || 0,
                coursesCount: coursesCount || 0,
                enrollmentsCount: activeEnrollments.length,
                revenue: estimatedRevenue
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Carregando métricas reais...</div>;
    }

    // Format currency
    const formatBRL = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral do desempenho da plataforma BioClass.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Alunos Cadastrados"
                    value={stats.studentsCount}
                    change="Base de leads"
                    icon={Users}
                    color="text-blue-600"
                    bg="bg-blue-100"
                />
                <StatCard
                    title="Cursos Ativos"
                    value={stats.coursesCount}
                    change="Catálogo atual"
                    icon={BookOpen}
                    color="text-teal-600"
                    bg="bg-teal-100"
                />
                <StatCard
                    title="Matrículas Totais"
                    value={stats.enrollmentsCount}
                    change="Ativas e Pend."
                    icon={GraduationCap}
                    color="text-purple-600"
                    bg="bg-purple-100"
                />
                <StatCard
                    title="Receitas Totais"
                    value={formatBRL(stats.revenue)}
                    change="Caixa Real + Pendente"
                    icon={TrendingUp}
                    color="text-green-600"
                    bg="bg-green-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Inscrições Recentes</h2>
                    <div className="space-y-4">
                        {recentEnrollments.length === 0 ? (
                            <p className="text-sm text-slate-500">Nenhuma matrícula recente.</p>
                        ) : (
                            recentEnrollments.map((enrollment, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold">
                                            {enrollment.profiles?.full_name?.charAt(0)?.toUpperCase() || "A"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{enrollment.profiles?.full_name || "Aluno Desconhecido"}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{enrollment.courses?.title || "Curso Indisponível"}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${enrollment.status === 'active' || enrollment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {enrollment.status === 'active' || enrollment.status === 'completed' ? 'Paga/Ativa' : 'Pendente'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Cursos Mais Populares</h2>
                    <div className="space-y-6 mt-6">
                        {popularCourses.length === 0 ? (
                            <p className="text-sm text-slate-500">Nenhum dado de curso.</p>
                        ) : (
                            popularCourses.map((course, index) => {
                                // Calculate percentage based on max element
                                const maxCount = Math.max(...popularCourses.map(p => p.count));
                                const percentage = maxCount > 0 ? (course.count / maxCount) * 100 : 0;

                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm items-end">
                                            <span className="font-semibold text-slate-700 max-w-[250px] truncate">{course.title}</span>
                                            <span className="text-primary font-bold">{course.count} matrículas</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`${bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {change.split(' ')[0]}
                </span>
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-xs text-slate-400 mt-1">{change}</p>
            </div>
        </div>
    );
}
