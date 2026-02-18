import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (signUpError) throw signUpError;

            setSuccess(true);
            // Opcional: Redirecionar após alguns segundos ou manter na tela avisando sobre confirmação de email
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Erro ao criar conta.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">Crie sua Conta</h2>
                <form className="space-y-4" onSubmit={handleRegister}>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">Conta criada com sucesso! Verifique seu e-mail.</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Seu Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Já tem conta? <Link to="/login" className="text-primary hover:underline">Faça Login</Link>
                </p>
            </div>
        </div>
    );
}
