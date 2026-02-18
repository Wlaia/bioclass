import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

interface CourseData {
    title: string;
    description: string;
    image_url: string;
    category: string;
    duration: string;
    level: string;
    modules_count: number;
    price: number | null;
    status: 'active' | 'draft';
}

export function CourseForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CourseData>({
        title: "",
        description: "",
        image_url: "",
        category: "Geral",
        duration: "",
        level: "Iniciante",
        modules_count: 0,
        price: null,
        status: 'draft'
    });

    useEffect(() => {
        if (isEditing) {
            fetchCourse();
        }
    }, [id]);

    async function fetchCourse() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData(data);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            setError("Erro ao carregar dados do curso.");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('courses')
                    .update(formData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('courses')
                    .insert([formData]);
                if (error) throw error;
            }

            navigate("/admin/courses");
        } catch (err: any) {
            setError(err.message || "Erro ao salvar curso.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/courses")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Editar Curso" : "Novo Curso"}
                    </h1>
                    <p className="text-gray-500">
                        {isEditing ? "Atualize as informações do curso." : "Preencha os dados do novo curso."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título do Curso</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Ex: 40h"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="Iniciante">Iniciante</option>
                            <option value="Intermediário">Intermediário</option>
                            <option value="Avançado">Avançado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Módulos</label>
                        <input
                            type="number"
                            name="modules_count"
                            value={formData.modules_count}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price || ""}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Deixe vazio para Grátis"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status || 'draft'}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="draft">Rascunho</option>
                            <option value="active">Ativo</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate("/admin/courses")}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2">
                        <Save className="w-4 h-4" />
                        {loading ? "Salvando..." : "Salvar Curso"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
