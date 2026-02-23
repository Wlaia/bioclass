import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Obter sessão inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminStatus(session.user.id, session.user.email);
            }
        }).catch((err) => {
            console.error("Auth session error:", err);
        }).finally(() => {
            setLoading(false);
        });

        // Escutar mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) {
                checkAdminStatus(session.user.id, session.user.email);
            } else {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function checkAdminStatus(userId: string, email?: string) {
        // 1. Verificação por e-mail (Segurança redundante conforme solicitado)
        const adminEmails = [
            "wellingtonlaialopes@gmail.com",
            "contato@bioclasscursos.com.br"
        ];

        if (email && adminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
            console.log("⭐ Auth: Admin detectado por e-mail:", email);
            setIsAdmin(true);
            return;
        }

        // 2. Verificação por Role no Banco de Dados
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error("Auth: Erro ao verificar role no banco:", error.message);
                }
                setIsAdmin(false);
                return;
            }

            console.log("Auth: Role do usuário no banco:", data?.role);
            setIsAdmin(data?.role === 'admin');
        } catch (err) {
            console.error("Auth: Erro crítico em checkAdminStatus:", err);
            setIsAdmin(false);
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-primary">Carregando aplicação...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
