import { Button } from "@/components/ui/button";
import { Plus, Search, FileEdit, Trash } from "lucide-react";

export function AdminCourses() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gerenciar Cursos</h1>
                    <p className="text-muted-foreground">Adicione, edite ou remova cursos da plataforma.</p>
                </div>
                <Button className="gap-2">
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
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="text-sm border rounded-md px-3 py-2 bg-white">
                            <option>Todos os Status</option>
                            <option>Ativo</option>
                            <option>Rascunho</option>
                        </select>
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Curso</th>
                            <th className="px-6 py-3">Instrutor</th>
                            <th className="px-6 py-3">Alunos</th>
                            <th className="px-6 py-3">Preço</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {[1, 2, 3, 4].map((i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-200 rounded-md bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=150&q=80)' }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Biomedicina Estética {i}</p>
                                            <p className="text-xs text-muted-foreground">Módulo Intermediário</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">Dra. Ana Silva</td>
                                <td className="px-6 py-4 text-slate-600">124</td>
                                <td className="px-6 py-4 font-medium">R$ 1.290,00</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                                        Ativo
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                                            <FileEdit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600">
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t bg-slate-50/50 text-center text-sm text-muted-foreground">
                    Mostrando 4 de 24 cursos
                </div>
            </div>
        </div>
    );
}
