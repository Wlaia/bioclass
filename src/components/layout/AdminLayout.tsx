import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

// ... imports above

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: BookOpen, label: "Cursos", href: "/admin/courses" },
    { icon: Users, label: "Alunos", href: "/admin/users" },
    { icon: BookOpen, label: "Matrículas", href: "/admin/students" },
    { icon: DollarSign, label: "Financeiro", href: "/admin/finance" },
    { icon: Users, label: "Professores", href: "/admin/instructors" },
    { icon: Settings, label: "Configurações", href: "/admin/settings" },
];

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAdmin, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!isAdmin) {
                navigate("/student", { replace: true });
            } else {
                setLoading(false);
            }
        }
    }, [isAdmin, authLoading, navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-primary font-medium">Verificando permissões de acesso...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b flex justify-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="BioClass Logo" className="h-[75px] w-auto object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                location.pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 md:hidden">
                    <h1 className="font-bold text-primary">BioClass Admin</h1>
                    {/* Mobile menu toggle would go here */}
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
