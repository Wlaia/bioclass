import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Search,
    User,
    Edit,
    MapPin,
    GraduationCap,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Download,
    ChevronRight,
    Play
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/student/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function AdminStudents() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [studentDocs, setStudentDocs] = useState<any[]>([]);
    const [studentProgress, setStudentProgress] = useState<any[]>([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        setLoading(true);
        try {
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            const { data: enrollmentsData, error: enrollmentsError } = await supabase
                .from('enrollments')
                .select(`
                    id, 
                    user_id, 
                    status,
                    courses:course_id (id, title, modules_count)
                `);

            if (enrollmentsError) throw enrollmentsError;

            const combined = profilesData.map(profile => {
                const userEnrollments = enrollmentsData.filter(e => e.user_id === profile.id);
                return {
                    ...profile,
                    enrollments: userEnrollments
                };
            });

            setStudents(combined);
        } catch (error: any) {
            console.error("Erro ao buscar alunos:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchStudentDetails = async (studentId: string) => {
        try {
            // Fetch Documents
            const { data: docs } = await supabase
                .from('student_documents')
                .select('*')
                .eq('user_id', studentId);

            setStudentDocs(docs || []);

            // Fetch Progress
            const { data: progress } = await supabase
                .from('lesson_progress')
                .select(`
                    *,
                    courses:course_id (title)
                `)
                .eq('user_id', studentId);

            setStudentProgress(progress || []);
        } catch (error) {
            console.error("Error fetching student details:", error);
        }
    };

    const filteredStudents = students.filter(student => {
        const term = searchTerm.toLowerCase();
        const fullName = student.full_name?.toLowerCase() || "";
        const email = student.email?.toLowerCase() || "";
        const cpf = student.cpf?.toLowerCase() || "";
        return fullName.includes(term) || email.includes(term) || cpf.includes(term);
    });

    const handleEditClick = (student: any) => {
        setSelectedStudent(student);
        fetchStudentDetails(student.id);
        setEditDialogOpen(true);
    };

    const handleEditSuccess = () => {
        setEditDialogOpen(false);
        setSelectedStudent(null);
        fetchStudents();
    };

    const exportToCSV = () => {
        const headers = ["Nome", "CPF", "Email", "Telefone", "Cidade", "Estado", "Formação"];
        const rows = filteredStudents.map(s => [
            s.full_name,
            s.cpf,
            s.email,
            s.phone,
            s.city,
            s.state,
            s.formacao
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `alunos_bioclass_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const updateDocStatus = async (docType: string, status: string) => {
        if (!selectedStudent) return;
        try {
            const { error } = await supabase
                .from('student_documents')
                .upsert({
                    user_id: selectedStudent.id,
                    document_type: docType,
                    status: status,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, document_type' });

            if (error) throw error;
            fetchStudentDetails(selectedStudent.id);
        } catch (error) {
            console.error("Error updating doc status:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestão de Alunos</h1>
                    <p className="text-muted-foreground">Gerenciamento completo acadêmico e documental.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={exportToCSV}>
                        <Download className="w-4 h-4" /> Exportar CSV
                    </Button>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
                        <User className="w-4 h-4" />
                        <span>{students.length} Alunos</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-4 border-b flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou CPF..."
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[11px] tracking-wider border-b">
                            <tr>
                                <th className="px-6 py-4">Aluno / Identificação</th>
                                <th className="px-6 py-4">Status Docs</th>
                                <th className="px-6 py-4">Localidade</th>
                                <th className="px-6 py-4">Matrículas</th>
                                <th className="px-6 py-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        Carregando alunos...
                                    </div>
                                </td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-slate-500">Nenhum aluno encontrado.</td></tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleEditClick(student)}>
                                        <td className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-slate-900">{student.full_name || "Incompleto"}</p>
                                                <p className="text-[11px] flex items-center gap-1 text-slate-400">
                                                    <span className="font-mono">{student.cpf}</span>
                                                    <span>•</span>
                                                    <span>{student.email}</span>
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                                <span className="text-[10px] font-medium text-slate-500">Pendente</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-700">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="font-medium text-[11px]">{student.city || "-"} - {student.state || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {student.enrollments?.map((e: any) => (
                                                    <div
                                                        key={e.id}
                                                        title={e.courses?.title}
                                                        className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white
                                                            ${e.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                    >
                                                        {e.courses?.title?.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Ficha do Aluno</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="profile">Perfil</TabsTrigger>
                            <TabsTrigger value="docs">Documentos</TabsTrigger>
                            <TabsTrigger value="progress">Desempenho</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-0">
                            {selectedStudent && (
                                <ProfileForm
                                    initialData={selectedStudent}
                                    onSuccess={handleEditSuccess}
                                    onCancel={() => setEditDialogOpen(false)}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="docs">
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" /> Checklist de Documentação
                                </h3>
                                <div className="space-y-3">
                                    {['RG', 'CPF', 'CERTIFICADO_GRADUACAO', 'COMPROVANTE_RESIDENCIA'].map(type => {
                                        const doc = studentDocs.find(d => d.document_type === type);
                                        return (
                                            <div key={type} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    {doc?.status === 'verified' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-yellow-500" />}
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">{type.replace('_', ' ')}</p>
                                                        <p className="text-xs text-slate-400">{doc?.status || 'Pendente'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => updateDocStatus(type, 'verified')}>Validar</Button>
                                                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => updateDocStatus(type, 'rejected')}>Recusar</Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="progress">
                            <div className="space-y-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Play className="w-4 h-4 text-primary" /> Progresso Acadêmico
                                </h3>
                                {selectedStudent?.enrollments?.length > 0 ? (
                                    selectedStudent.enrollments.map((e: any) => {
                                        const courseProgress = studentProgress.filter(p => p.course_id === e.courses?.id);
                                        const percentage = e.courses?.modules_count ? Math.round((courseProgress.length / (e.courses.modules_count * 3)) * 100) : 0; // Rough math

                                        return (
                                            <div key={e.id} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{e.courses?.title}</p>
                                                        <p className="text-xs text-slate-500">{courseProgress.length} aulas assistidas</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-primary">{percentage}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center py-8 text-slate-400 italic">Nenhuma matrícula ativa.</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    );
}
