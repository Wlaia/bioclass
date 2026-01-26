import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    BookOpen,
    Award,
    Settings,
    LogOut,
    Bell,
    Search,
    GraduationCap,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";

export function StudentLayout() {
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
        { icon: BookOpen, label: "Meus Cursos", path: "/student/courses" },
        { icon: Award, label: "Certificados", path: "/student/certificates" },
        { icon: Settings, label: "Configurações", path: "/student/settings" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center px-6 border-b border-gray-100">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-gray-900 text-lg">BioClass</span>
                        </Link>
                    </div>

                    <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== "/student" && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start gap-3 h-12 font-medium ${isActive
                                                ? "bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                                                : "text-gray-500 hover:text-gray-900"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-gray-100">
                        <Link to="/login">
                            <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <LogOut className="w-5 h-5" />
                                Sair da Conta
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30">
                    <button
                        className="md:hidden p-2 -ml-2 text-gray-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden md:flex flex-1 max-w-md ml-4 mr-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar nos meus cursos..."
                                className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-none">Wellington Lopes</p>
                                <p className="text-xs text-gray-500 mt-1">Plano Premium</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm">
                                WL
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 md:p-8 animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
