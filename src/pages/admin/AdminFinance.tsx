import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    TrendingUp,
    TrendingDown,
    Search,
    Download,
    Clock,
    Plus,
    FileText,
    Calculator,
    Trash2,
    Calendar,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/admin/ExpenseForm";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function AdminFinance() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingRevenue: 0,
        totalExpenses: 0,
        pendingExpenses: 0,
        balance: 0
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("receivables");
    const [isExpenseDialogOpen, setExpenseDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            // 1. Fetch Enrollments (EXACTLY like dashboard query that works)
            const { data: enrollsData, error: enrollsError } = await supabase
                .from('enrollments')
                .select('id, status, enrolled_at, courses ( title, price ), profiles ( full_name )')
                .order('enrolled_at', { ascending: false });

            if (enrollsError) {
                console.error("Finance: Error fetching enrollments:", enrollsError);
            }

            // 2. Fetch Manual Transactions (Resilient fetch)
            const { data: transData, error: transError } = await supabase
                .from('transactions')
                .select('*')
                .order('transaction_date', { ascending: false });

            if (transError && transError.code !== 'PGRST116') { // PGRST116 is often 'relation not found'
                console.warn("Finance: Manual transactions table issue:", transError.message);
            }

            // 3. Fetch Expenses
            const { data: expData, error: expError } = await supabase
                .from('expenses')
                .select('*')
                .order('due_date', { ascending: true });

            if (expError) {
                console.error("Finance: Error fetching expenses:", expError);
            }

            // 4. Normalize Enrollments into Recipes
            const recipes = (enrollsData || []).map((e: any) => {
                const course = Array.isArray(e.courses) ? e.courses[0] : e.courses;
                const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;

                // Normalizing status to "paid" or "pending"
                const rawStatus = (e.status || "").toLowerCase();
                const isPaid = ['active', 'ativo', 'completed', 'concluido'].includes(rawStatus);

                return {
                    id: `enroll-${e.id}`,
                    transaction_date: e.enrolled_at,
                    amount: Number(course?.price) || 0,
                    payment_method: 'manual',
                    status: isPaid ? 'paid' : 'pending',
                    description: `Matrícula: ${course?.title || 'Curso'}`,
                    category: 'receita',
                    profiles: {
                        full_name: profile?.full_name || "Aluno"
                    },
                    enrollment_id: e.id
                };
            });

            // 5. Normalize manual transactions (if any)
            const manualTrans = (transData || []).map(t => ({
                ...t,
                id: `trans-${t.id}`,
                status: t.status || 'paid'
            }));

            // Merge and sort
            const allTransactions = [...manualTrans, ...recipes].sort((a, b) => {
                const d1 = new Date(a.transaction_date).getTime() || 0;
                const d2 = new Date(b.transaction_date).getTime() || 0;
                return d2 - d1;
            });

            setTransactions(allTransactions);
            setExpenses(expData || []);
            calculateGlobalStats(allTransactions, expData || []);

        } catch (error: any) {
            console.error("Critical error in AdminFinance fetchData:", error);
        } finally {
            setLoading(false);
        }
    }

    const calculateGlobalStats = (trans: any[], exps: any[]) => {
        const totalRevenue = trans.filter(t => t.status === 'paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const pendingRevenue = trans.filter(t => t.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount), 0);

        const totalExpenses = exps.filter(e => e.status === 'paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const pendingExpenses = exps.filter(e => e.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount), 0);

        setStats({
            totalRevenue,
            pendingRevenue,
            totalExpenses,
            pendingExpenses,
            balance: totalRevenue - totalExpenses
        });
    };

    const formatBRL = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;
        try {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const term = searchTerm.toLowerCase().trim();
        const studentName = t.profiles?.full_name?.toLowerCase() || "";
        const description = t.description?.toLowerCase() || "";
        const matchesSearch = !term || studentName.includes(term) || description.includes(term);
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;

        // Date filter
        const tDate = new Date(t.transaction_date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23, 59, 59, 999);
        const matchesDate = (!start || tDate >= start) && (!end || tDate <= end);

        // Category filter
        const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesDate && matchesCategory;
    });

    const filteredExpenses = expenses.filter(e => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = e.description.toLowerCase().includes(term) || e.provider?.toLowerCase().includes(term);
        const matchesStatus = statusFilter === "all" || e.status === statusFilter;

        // Date filter
        const eDate = new Date(e.due_date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23, 59, 59, 999);
        const matchesDate = (!start || eDate >= start) && (!end || eDate <= end);

        // Category filter
        const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesDate && matchesCategory;
    });

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        const logoUrl = "/logobioclass.png";
        doc.addImage(logoUrl, 'PNG', 15, 10, 35, 10);

        doc.setFontSize(18);
        doc.setTextColor(33, 33, 33);
        doc.text("Relatório Financeiro - BioClass", 15, 30);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 15, 37);

        // Stats Summary
        doc.setFillColor(248, 250, 252);
        doc.rect(15, 45, pageWidth - 30, 25, 'F');

        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text("Resumo Financeiro", 20, 52);

        doc.setFontSize(12);
        doc.setTextColor(33, 91, 54); // Green for revenue
        doc.text(`Receita Realizada: ${formatBRL(stats.totalRevenue)}`, 20, 62);

        doc.setTextColor(127, 29, 29); // Red for expenses
        doc.text(`Despesas Pagas: ${formatBRL(stats.totalExpenses)}`, 85, 62);

        doc.setTextColor(15, 23, 42); // Slate for balance
        doc.text(`Saldo em Caixa: ${formatBRL(stats.balance)}`, 150, 62);

        // Filters applied
        let filterDesc = "Filtros: " + (statusFilter === "all" ? "Todos os status" : statusFilter === "paid" ? "Pagos" : "Pendentes");
        if (startDate || endDate) {
            filterDesc += ` | Período: ${startDate || 'Início'} até ${endDate || 'Fim'}`;
        }
        if (categoryFilter !== "all") {
            filterDesc += ` | Categoria: ${categoryFilter}`;
        }
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(filterDesc, 15, 75);

        // Table
        if (activeTab === "receivables") {
            const tableData = filteredTransactions.map(t => [
                new Date(t.transaction_date).toLocaleDateString(),
                t.profiles?.full_name || "N/A",
                t.description || "Matrícula",
                formatBRL(t.amount),
                t.status === 'paid' ? 'Pago' : 'Pendente'
            ]);

            autoTable(doc, {
                startY: 80,
                head: [['Data', 'Aluno', 'Descrição', 'Valor', 'Status']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: 15, right: 15 }
            });
        } else {
            const tableData = filteredExpenses.map(e => [
                new Date(e.due_date).toLocaleDateString(),
                e.provider || "N/A",
                e.description,
                e.category,
                formatBRL(e.amount),
                e.status === 'paid' ? 'Pago' : 'Pendente'
            ]);

            autoTable(doc, {
                startY: 80,
                head: [['Vencimento', 'Fornecedor', 'Descrição', 'Categoria', 'Valor', 'Status']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: 15, right: 15 }
            });
        }

        doc.save(`relatorio-financeiro-bioclass-${new Date().getTime()}.pdf`);
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Carregando dados financeiros...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestão Financeira</h1>
                    <p className="text-muted-foreground">Controle central de entradas e saídas da escola.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                        <Download className="w-4 h-4" /> Exportar
                    </Button>
                    <Button className="gap-2" onClick={() => { setSelectedExpense(null); setExpenseDialogOpen(true); }}>
                        <Plus className="w-4 h-4" /> Nova Despesa
                    </Button>
                </div>
            </div>

            {/* Global Vision */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Receita Realizada</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-green-600">{formatBRL(stats.totalRevenue)}</h3>
                        <TrendingUp className="w-5 h-5 text-green-500/50" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Despesas Pagas</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-red-600">{formatBRL(stats.totalExpenses)}</h3>
                        <TrendingDown className="w-5 h-5 text-red-500/50" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm border-b-4 border-b-primary">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Saldo em Caixa</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-900">{formatBRL(stats.balance)}</h3>
                        <Calculator className="w-5 h-5 text-primary/50" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Previsão Pendente</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-yellow-600">{formatBRL(stats.pendingRevenue - stats.pendingExpenses)}</h3>
                        <Clock className="w-5 h-5 text-yellow-500/50" />
                    </div>
                </div>
            </div>

            <Tabs defaultValue="receivables" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="receivables" className="gap-2">
                        <TrendingUp className="w-4 h-4" /> Receitas
                    </TabsTrigger>
                    <TabsTrigger value="payables" className="gap-2">
                        <TrendingDown className="w-4 h-4" /> Despesas
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6 bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex flex-col md:flex-row items-center gap-4 bg-slate-50/50">
                        <div className="relative flex-1 max-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou descrição..."
                                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    title="Data Início"
                                />
                            </div>
                            <span className="text-slate-400">até</span>
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    title="Data Fim"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    className="pl-9 pr-8 py-2 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="all">Todas Categorias</option>
                                    <option value="receita">Receitas (Matrículas)</option>
                                    <option value="aluguel">Aluguel / Infra</option>
                                    <option value="salarios">Salários / Professores</option>
                                    <option value="marketing">Marketing / Ads</option>
                                    <option value="outros">Outros</option>
                                </select>
                            </div>

                            <select
                                className="text-sm border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Todos Status</option>
                                <option value="paid">Pago</option>
                                <option value="pending">Pendente</option>
                            </select>

                            {(searchTerm || startDate || endDate || categoryFilter !== "all" || statusFilter !== "all") && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-slate-500 hover:text-primary"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStartDate("");
                                        setEndDate("");
                                        setCategoryFilter("all");
                                        setStatusFilter("all");
                                    }}
                                >
                                    Limpar
                                </Button>
                            )}
                        </div>
                    </div>

                    <TabsContent value="receivables" className="m-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[11px] border-b">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Aluno</th>
                                        <th className="px-6 py-4">Descrição</th>
                                        <th className="px-6 py-4 text-right">Valor</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredTransactions.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 text-slate-500">{new Date(t.transaction_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold">{t.profiles?.full_name || "N/A"}</td>
                                            <td className="px-6 py-4 text-slate-600">{t.description || "Matrícula"}</td>
                                            <td className="px-6 py-4 text-right font-bold text-green-700">{formatBRL(t.amount)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {t.status === 'paid' ? 'Pago' : 'Pendente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Nenhuma receita encontrada.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    <TabsContent value="payables" className="m-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[11px] border-b">
                                    <tr>
                                        <th className="px-6 py-4">Vencimento</th>
                                        <th className="px-6 py-4">Fornecedor / Item</th>
                                        <th className="px-6 py-4">Categoria</th>
                                        <th className="px-6 py-4 text-right">Valor</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredExpenses.map(e => (
                                        <tr key={e.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 text-slate-500">{new Date(e.due_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-bold">{e.provider || "N/A"}</p>
                                                    {e.total_installments > 1 && (
                                                        <span className="text-[9px] bg-slate-100 px-1 rounded text-slate-500 font-medium">
                                                            {e.current_installment}/{e.total_installments}
                                                        </span>
                                                    )}
                                                    {e.is_recurring && (
                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-400">{e.description}</p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 capitalize">{e.category}</td>
                                            <td className="px-6 py-4 text-right font-bold text-red-700">{formatBRL(e.amount)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${e.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {e.status === 'paid' ? 'Pago' : 'Pendente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedExpense(e); setExpenseDialogOpen(true); }}>
                                                        <FileText className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => handleDeleteExpense(e.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredExpenses.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Nenhuma despesa cadastrada.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            <Dialog open={isExpenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedExpense ? "Editar Despesa" : "Nova Despesa / Conta a Pagar"}</DialogTitle>
                    </DialogHeader>
                    <ExpenseForm
                        initialData={selectedExpense}
                        onSuccess={() => { setExpenseDialogOpen(false); fetchData(); }}
                        onCancel={() => setExpenseDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
