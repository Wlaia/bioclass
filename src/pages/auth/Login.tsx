import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            navigate("/student");
        } catch (err: any) {
            setError(err.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : "Erro ao fazer login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="BioClass Logo" className="h-16 w-auto object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">Acesse sua Conta</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

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
                        />
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                                Esqueci minha senha
                            </Link>
                        </div>
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem conta? <Link to="/register" className="text-primary hover:underline">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
}
