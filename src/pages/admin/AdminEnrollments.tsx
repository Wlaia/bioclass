import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Search, CheckCircle, Clock, XCircle } from "lucide-react";

export function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchEnrollments();
    }, []);

    async function fetchEnrollments() {
        setLoading(true);
        try {
            // Join with profiles and courses
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
                    *,
                    user_id,
                    course_id,
                    profiles:user_id (full_name, cpf),
                    courses:course_id (title, price)
                `)
                .order('enrolled_at', { ascending: false });

            if (error) throw error;
            if (data) setEnrollments(data);
        } catch (error: any) {
            console.error("Catch Error:", error);
            alert(`Erro ao buscar matrículas: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (id: string) => {
        if (!confirm("Confirmar a ativação desta matrícula?")) return;

        try {
            const { error } = await supabase
                .from('enrollments')
                .update({ status: 'active' })
                .eq('id', id);

            if (error) throw error;

            // Register financial transaction automatically
            const enrollment = enrollments.find(e => e.id === id);
            if (enrollment) {
                await supabase
                    .from('transactions')
                    .insert({
                        enrollment_id: id,
                        user_id: enrollment.user_id,
                        amount: enrollment.courses?.price || 0,
                        payment_method: enrollment.payment_method || 'manual',
                        status: 'paid',
                        description: `Aprovação de Matrícula: ${enrollment.courses?.title}`,
                        transaction_date: new Date().toISOString()
                    });
            }

            // Refresh list
            fetchEnrollments();
        } catch (error) {
            console.error("Error approving enrollment:", error);
            alert("Erro ao ativar matrícula.");
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'cancelled' : 'active';
        if (!confirm(`Alterar status para ${newStatus}?`)) return;

        try {
            const { error } = await supabase
                .from('enrollments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchEnrollments();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const filteredEnrollments = enrollments.filter(enrollment => {
        const term = searchTerm.toLowerCase();
        const studentName = enrollment.profiles?.full_name?.toLowerCase() || "";
        const courseTitle = enrollment.courses?.title?.toLowerCase() || "";

        const matchesSearch = studentName.includes(term) || courseTitle.includes(term);
        const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestão de Matrículas</h1>
                    <p className="text-muted-foreground">Aprove e gerencie o acesso dos alunos aos cursos.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar aluno ou curso..."
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="text-sm border rounded-md px-3 py-2 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="pending">Pendente</option>
                            <option value="active">Ativo</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Aluno</th>
                                <th className="px-6 py-3">Curso</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center">Carregando...</td></tr>
                            ) : filteredEnrollments.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center">Nenhuma matrícula encontrada.</td></tr>
                            ) : (
                                filteredEnrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{enrollment.profiles?.full_name || "N/A"}</p>
                                                <p className="text-xs text-muted-foreground">{enrollment.profiles?.cpf || "CPF não inf."}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {enrollment.courses?.title}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${enrollment.status === 'active'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : enrollment.status === 'pending'
                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                {enrollment.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                                {enrollment.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {enrollment.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                                {enrollment.status === 'active' ? 'Ativo' : enrollment.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.status === 'pending' && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(enrollment.id)}>
                                                    Aprovar Pagamento
                                                </Button>
                                            )}
                                            {enrollment.status !== 'pending' && (
                                                <Button variant="ghost" size="sm" onClick={() => toggleStatus(enrollment.id, enrollment.status)}>
                                                    Alterar Status
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
