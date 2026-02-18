import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
    id: string;
    full_name: string;
    cpf: string;
    phone: string;
    address: string;
    number: string;
    city: string;
    state: string;
    zip_code: string;
}

interface ProfileFormProps {
    initialData?: Partial<Profile>;
    onSuccess: () => void;
    onCancel?: () => void;
}

export function ProfileForm({ initialData, onSuccess, onCancel }: ProfileFormProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Profile> & { email?: string }>({
        full_name: "",
        cpf: "",
        phone: "",
        address: "",
        number: "",
        city: "",
        state: "",
        zip_code: "",
        email: "",
        ...initialData
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email,
                // Only set full_name from auth if not already present in initialData or current state
                full_name: prev.full_name || initialData?.full_name || user.user_metadata?.full_name || prev.full_name || "",
                ...initialData // initialData overrides only if it has values, but we handled full_name specifically
            }));

            // Refine merging strategy: initialData should win if it exists (database), 
            // otherwise fallback to auth data, otherwise empty.
            if (initialData?.id) {
                setFormData(prev => ({ ...prev, ...initialData }));
            }
        }
    }, [user, initialData]);

    const formatCEP = (value: string) => {
        return value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
    };

    const handleCEPChange = async (cep: string) => {
        const cleanCEP = cep.replace(/\D/g, '');
        if (cleanCEP.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        address: data.logradouro,
                        city: data.localidade,
                        state: data.uf,
                        // Maintain CEP formatted
                    }));
                }
            } catch (error) {
                console.error("Error fetching CEP:", error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'zip_code') {
            const formatted = formatCEP(value);
            setFormData(prev => ({ ...prev, [name]: formatted }));
            if (formatted.replace(/\D/g, '').length === 8) {
                handleCEPChange(formatted);
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!user) throw new Error("Usuário não autenticado");

            // Remove email from updates as it's not in the profiles table
            const { email, ...profileData } = formData;

            const updates = {
                id: user.id,
                ...profileData,
                updated_at: new Date().toISOString(),
            };

            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert(updates);

            if (upsertError) throw upsertError;

            onSuccess();
        } catch (err: any) {
            setError(err.message || "Erro ao salvar perfil.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={formData.email || ""}
                        className="w-full p-2 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                        type="text"
                        name="cpf"
                        value={formData.cpf || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="000.000.000-00"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="(00) 00000-0000"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="00000-000"
                        required
                    />
                </div>
                <div className="md:col-span-2 grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Rua, Av..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="123"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="UF"
                        maxLength={2}
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar e Continuar"}
                </Button>
            </div>
        </form>
    );
}
