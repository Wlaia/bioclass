import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formacao, setFormacao] = useState("");
    const [cpf, setCpf] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [phone, setPhone] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
                    setAddress(data.logradouro);
                    setCity(data.localidade);
                    setState(data.uf);
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!name || !email || !password || !formacao || !cpf || !birthDate || !phone || !zipCode || !address || !number || !city || !state) {
                throw new Error("Por favor, preencha todos os campos obrigatórios.");
            }

            // 1. Auth SignUp
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                        full_name: name,
                        formacao: formacao,
                        birth_date: birthDate,
                    },
                },
            });

            if (signUpError) throw signUpError;
            if (!authData.user) throw new Error("Erro ao criar usuário.");

            // 2. Create Profile immediately
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    full_name: name,
                    email,
                    cpf,
                    birth_date: birthDate,
                    phone,
                    address,
                    number,
                    city,
                    state,
                    zip_code: zipCode,
                    formacao,
                    updated_at: new Date().toISOString()
                });

            if (profileError) {
                console.error("Erro ao criar perfil:", profileError);
                // Note: Auth user exists, but profile failed. 
                // We'll proceed since they can fix it in settings, 
                // but let's log it.
            }

            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 6000);
        } catch (err: any) {
            setError(err.message || "Erro ao criar conta.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
                    <p className="text-gray-600 mb-6">
                        Criamos sua conta com sucesso. Enviamos um <strong>e-mail de confirmação</strong> para <span className="font-medium text-gray-900">{email}</span>.
                        <br /><br />
                        <strong>Ative sua conta pelo e-mail</strong> para começar seus cursos.
                    </p>
                    <Button onClick={() => navigate("/login")} className="w-full">
                        Ir para o Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex justify-center mb-8">
                    <img src="/logo.png" alt="BioClass Logo" className="h-16 w-auto object-contain" />
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-primary">Crie sua Conta</h2>
                    <p className="mt-2 text-sm text-gray-500">Preencha seus dados para acessar a plataforma.</p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados Pessoais</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Seu Nome Completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                <input
                                    type="email"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="000.000.000-00"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp/Fone</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="(00) 00000-0000"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Formação</label>
                                <select
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white text-gray-700 transition-all"
                                    value={formacao}
                                    onChange={(e) => setFormacao(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecione sua formação...</option>
                                    <option value="Estudante">Estudante</option>
                                    <option value="Enfermeiro">Enfermeiro(a)</option>
                                    <option value="Tec Enfermagem">Téc. de Enfermagem</option>
                                    <option value="Biomédico">Biomédico(a)</option>
                                    <option value="Técnico Analises">Técnico(a) em Análises Clínicas</option>
                                    <option value="Outros">Outras Áreas (Saúde)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Acesso</label>
                                <input
                                    type="password"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Endereço</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="00000-000"
                                    value={zipCode}
                                    onChange={(e) => {
                                        const formatted = formatCEP(e.target.value);
                                        setZipCode(formatted);
                                        if (formatted.replace(/\D/g, '').length === 8) {
                                            handleCEPChange(formatted);
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rua / Logradouro</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Rua, Avenida..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="123"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-not-allowed bg-gray-50"
                                        value={city}
                                        readOnly
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-not-allowed bg-gray-50"
                                    value={state}
                                    readOnly
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
                            {loading ? "Criando sua conta..." : "Finalizar Cadastro e Começar"}
                        </Button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Já possui uma conta? <Link to="/login" className="text-primary font-bold hover:underline">Acessar minha área</Link>
                </p>
            </div>
        </div>
    );
}
