import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Erro ao solicitar recuperação de senha.");
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">E-mail Enviado!</h2>
                        <p className="text-gray-600 mb-6">
                            Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
                        </p>
                        <Link to="/login">
                            <Button className="w-full">Voltar para Login</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-2 text-primary">Recuperar Senha</h2>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Informe seu e-mail cadastrado e enviaremos as instruções para você criar uma nova senha.
                        </p>

                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">{error}</div>}

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

                            <Button className="w-full h-11" disabled={loading}>
                                {loading ? "Enviando e-mail..." : "Enviar Link de Recuperação"}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Lembrou a senha? <Link to="/login" className="text-primary font-bold hover:underline">Fazer Login</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
