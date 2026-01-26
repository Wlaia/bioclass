import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";

export function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral da plataforma.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Alunos" value="1,234" change="+12% este mês" icon={Users} color="text-blue-600" bg="bg-blue-100" />
                <StatCard title="Cursos Ativos" value="24" change="+3 novos cursos" icon={BookOpen} color="text-teal-600" bg="bg-teal-100" />
                <StatCard title="Certificados Emitidos" value="856" change="+45 na última semana" icon={GraduationCap} color="text-purple-600" bg="bg-purple-100" />
                <StatCard title="Receita Mensal" value="R$ 45.2k" change="+8% vs mês anterior" icon={TrendingUp} color="text-green-600" bg="bg-green-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Inscrições Recentes</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                                    <div>
                                        <p className="text-sm font-medium">Nome do Aluno {i}</p>
                                        <p className="text-xs text-muted-foreground">Curso de Biomedicina Estética</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500">Há 2h</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Cursos Mais Populares</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Harmonização Facial Avançada</span>
                                    <span className="text-slate-500">85% lotação</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                        ))}
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
