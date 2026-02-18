import { Clock, BarChart, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface CourseProps {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    duration: string;
    level: "Iniciante" | "Intermediário" | "Avançado";
    modules: number;
    price?: number;
}



interface CourseCardProps {
    course: CourseProps;
    variant?: "public" | "student" | "enroll";
    status?: "pending" | "active" | "completed" | "cancelled";
    onEnroll?: () => void;
}

export function CourseCard({ course, variant = "public", status, onEnroll }: CourseCardProps) {
    const getStatusBadge = () => {
        switch (status) {
            case "pending":
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Aguardando Confirmação</span>;
            case "active":
                return <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Inscrito</span>;
            case "completed":
                return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Concluído</span>;
            default:
                return null;
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border h-full flex flex-col">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {course.category}
                    </span>
                    {variant === "student" && getStatusBadge()}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
                    {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BarChart className="w-3.5 h-3.5" />
                        <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.modules} Módulos</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {variant === "public" ? (
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                                {course.price ? `R$ ${course.price.toFixed(2)}` : "Grátis"}
                            </span>
                            <Link to={`/curso/${course.id}`}>
                                <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group-hover:translate-x-1 transition-all duration-300">
                                    Ver Detalhes <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    ) : variant === "enroll" ? (
                        <Button
                            className="w-full rounded-xl bg-green-600 hover:bg-green-700 shadow-md text-white"
                            onClick={onEnroll}
                        >
                            Matricular-se
                        </Button>
                    ) : (
                        <div className="space-y-2">
                            {status === "pending" && (
                                <Link to="/student/payment" className="w-full block">
                                    <Button variant="outline" className="w-full rounded-xl border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                                        Confirmar Pagamento
                                    </Button>
                                </Link>
                            )}
                            {status === "active" && (
                                <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-md cursor-default">
                                    Acessar Materiais (Presencial)
                                </Button>
                            )}
                            {status === "completed" && (
                                <Button variant="secondary" className="w-full rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                                    Ver Certificado
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
