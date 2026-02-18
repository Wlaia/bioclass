import { Button } from "@/components/ui/button";
import { Plus, Search, FileEdit, Trash, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export function AdminCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setCourses(data);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este curso?")) return;

        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("Erro ao excluir curso.");
        }
    };

    const handleConcludeCourse = async (courseId: string, courseTitle: string) => {
        if (!confirm(`Tem certeza que deseja CONCLUIR a turma "${courseTitle}"?\n\nIsso marcará TODOS os alunos inscritos como "Concluído" e liberará o certificado.`)) return;

        try {
            const { error } = await supabase
                .from('enrollments')
                .update({ status: 'completed' })
                .eq('course_id', courseId)
                .neq('status', 'cancelled'); // Don't reactivate cancelled ones

            if (error) throw error;
            alert(`Turma "${courseTitle}" concluída com sucesso!`);
            fetchCourses();
        } catch (error) {
            console.error("Error concluding course:", error);
            alert("Erro ao concluir turma.");
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gerenciar Cursos</h1>
                    <p className="text-muted-foreground">Adicione, edite ou remova cursos da plataforma.</p>
                </div>
                <Button className="gap-2" onClick={() => navigate("/admin/courses/new")}>
                    <Plus className="w-4 h-4" /> Novo Curso
                </Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar curso..."
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Curso</th>
                                <th className="px-6 py-3">Categoria</th>
                                <th className="px-6 py-3">Preço</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center">Carregando...</td></tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center">Nenhum curso encontrado.</td></tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-200 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${course.image_url})` }} />
                                                <div>
                                                    <p className="font-semibold text-slate-900">{course.title}</p>
                                                    <p className="text-xs text-muted-foreground">{course.modules_count} Módulos • {course.duration}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{course.category}</td>
                                        <td className="px-6 py-4 font-medium">
                                            {course.price ? `R$ ${course.price.toFixed(2)}` : "Grátis"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {course.status === 'active' ? 'Ativo' : 'Rascunho'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:text-green-600"
                                                    title="Concluir Turma / Emitir Certificados"
                                                    onClick={() => handleConcludeCourse(course.id, course.title)}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:text-blue-600"
                                                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                                                >
                                                    <FileEdit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:text-red-600"
                                                    onClick={() => handleDelete(course.id)}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t bg-slate-50/50 text-center text-sm text-muted-foreground">
                    Mostrando {filteredCourses.length} de {courses.length} cursos
                </div>
            </div>
        </div>
    );
}
