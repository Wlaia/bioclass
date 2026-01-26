import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">Acesse sua Conta</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input type="email" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none" placeholder="seu@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <input type="password" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none" placeholder="••••••••" />
                    </div>
                    <Button className="w-full">Entrar</Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem conta? <Link to="/register" className="text-primary hover:underline">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
}
