import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface ExpenseFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ExpenseForm({ initialData, onSuccess, onCancel }: ExpenseFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: initialData?.description || "",
        amount: initialData?.amount || "",
        due_date: initialData?.due_date || new Date().toISOString().split('T')[0],
        provider: initialData?.provider || "",
        category: initialData?.category || "outros",
        status: initialData?.status || "pending",
        notes: initialData?.notes || "",
        total_installments: initialData?.total_installments || 1,
        is_recurring: initialData?.is_recurring || false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const installments = Number(formData.total_installments) || 1;
            const parentId = crypto.randomUUID();

            if (initialData?.id) {
                // Update single expense
                const { error } = await supabase
                    .from('expenses')
                    .update({
                        ...formData,
                        amount: Number(formData.amount),
                        total_installments: installments
                    })
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                // Create one or multiple expenses (installments)
                const expensesToInsert = [];
                const baseDate = new Date(formData.due_date);

                for (let i = 0; i < installments; i++) {
                    const dueDate = new Date(baseDate);
                    dueDate.setMonth(baseDate.getMonth() + i);

                    expensesToInsert.push({
                        ...formData,
                        amount: Number(formData.amount),
                        due_date: dueDate.toISOString().split('T')[0],
                        total_installments: installments,
                        current_installment: i + 1,
                        parent_id: installments > 1 ? parentId : null,
                        created_by: user?.id
                    });
                }

                const { error } = await supabase
                    .from('expenses')
                    .insert(expensesToInsert);
                if (error) throw error;
            }

            onSuccess();
        } catch (error: any) {
            console.error("Error saving expense:", error);
            alert("Erro ao salvar despesa: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição / Item</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Aluguel, Luz, Professor João..."
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="0.00"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vencimento</label>
                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fornecedor</label>
                    <input
                        type="text"
                        name="provider"
                        value={formData.provider}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Nome da empresa ou pessoa"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
                    >
                        <option value="aluguel">Aluguel / Infra</option>
                        <option value="salarios">Salários / Professores</option>
                        <option value="marketing">Marketing / Ads</option>
                        <option value="impostos">Impostos</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status de Pagamento</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
                    >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="cancelled">Cancelado</option>
                    </select>
                </div>
                {!initialData?.id && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Total de Parcelas</label>
                        <input
                            type="number"
                            name="total_installments"
                            min="1"
                            max="60"
                            value={formData.total_installments}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_recurring"
                    name="is_recurring"
                    checked={formData.is_recurring}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary/20"
                />
                <label htmlFor="is_recurring" className="text-sm font-medium text-slate-700">Esta é uma despesa recorrente mensal</label>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Detalhes adicionais..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : initialData?.id ? "Atualizar Despesa" : "Cadastrar Despesa"}
                </Button>
            </div>
        </form>
    );
}
