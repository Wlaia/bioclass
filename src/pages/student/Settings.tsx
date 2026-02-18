import { ProfileForm } from "@/components/student/ProfileForm";
import { useOutletContext } from "react-router-dom";
import type { StudentContextType } from "@/components/layout/StudentLayout";
export function StudentSettings() {
    const { profile, refreshProfile } = useOutletContext<StudentContextType>();

    const handleSuccess = async () => {
        await refreshProfile();
        // Opcional: Mostrar toast de sucesso
        alert("Perfil atualizado com sucesso!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-500">Gerencie seus dados pessoais e preferências.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
                    <p className="text-sm text-gray-500">
                        Essas informações são utilizadas para sua matrícula e emissão de certificados.
                    </p>
                </div>

                <div className="h-px bg-gray-100 my-6" />

                <ProfileForm
                    initialData={profile || {}}
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    );
}

// Separator não existe ainda, vou criar um simples ou remover.
// Vou remover o import do Separator e fazer uma div simples para garantir.
