import { CourseCard, type CourseProps } from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, TrendingUp } from "lucide-react";

export function StudentDashboard() {
    const inProgressCourse = {
        title: "Biomedicina Estética Avançada",
        module: "Módulo 3: Toxina Botulínica",
        progress: 75,
        image: "https://images.unsplash.com/photo-1576091160550-2187d80018fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    };

    const myCourses: CourseProps[] = [
        {
            id: "1",
            title: "Biomedicina Estética Avançada",
            description: "Domine as técnicas de harmonização facial.",
            image: "https://images.unsplash.com/photo-1576091160550-2187d80018fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Estética",
            duration: "120h",
            level: "Avançado",
            modules: 12
        },
        {
            id: "2",
            title: "Microbiologia Clínica",
            description: "Identificação de patógenos e diagnósticos.",
            image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Laboratório",
            duration: "80h",
            level: "Intermediário",
            modules: 8
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Olá, Wellington 👋</h1>
                    <p className="text-gray-500">Continue de onde você parou.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <Award className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Certificados</p>
                            <p className="text-sm font-bold text-gray-900">3 Conquistados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Hero */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 text-white shadow-xl group cursor-pointer">
                <div className="absolute inset-0">
                    <img
                        src={inProgressCourse.image}
                        alt={inProgressCourse.title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                </div>

                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            <span>Em progresso</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{inProgressCourse.title}</h2>
                        <p className="text-lg text-gray-300">{inProgressCourse.module}</p>

                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs font-medium text-gray-300">
                                <span>Progresso Geral</span>
                                <span>{inProgressCourse.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${inProgressCourse.progress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <Button size="lg" className="rounded-full h-12 px-8 bg-white text-gray-900 hover:bg-gray-100 hover:text-primary font-bold shadow-2xl transition-all">
                            <PlayCircle className="w-5 h-5 mr-2 fill-current" />
                            Continuar Aula
                        </Button>
                    </div>
                </div>
            </div>

            {/* My Courses */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Meus Cursos</h2>
                    <Button variant="link" className="text-primary">Ver todos</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCourses.map(course => (
                        <div key={course.id} className="h-full">
                            <CourseCard course={course} variant="student" />
                        </div>
                    ))}

                    {/* Add New Course Card */}
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-white group-hover:text-primary group-hover:shadow-md transition-all">
                            <span className="text-4xl font-light">+</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Adicionar Curso</h3>
                        <p className="text-sm text-gray-500">Explore o catálogo para aprender mais</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
