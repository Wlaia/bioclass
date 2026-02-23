import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Ensure we have a session (Supabase handles this via the link)
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                // We're good to go
            } else if (!session && event !== "INITIAL_SESSION") {
                // If no session and not in recovery, redirect to login
                // navigate("/login");
            }
        });
    }, [navigate]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar senha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="BioClass Logo" className="h-16 w-auto object-contain" />
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Senha Atualizada!</h2>
                        <p className="text-gray-600 mb-6">
                            Sua senha foi redefinida com sucesso. Redirecionando para o login...
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-2 text-primary">Nova Senha</h2>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Digite sua nova senha de acesso abaixo.
                        </p>

                        <form className="space-y-4" onSubmit={handleUpdatePassword}>
                            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">{error}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                                <input
                                    type="password"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button className="w-full h-11" disabled={loading}>
                                {loading ? "Atualizando..." : "Salvar Nova Senha"}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
