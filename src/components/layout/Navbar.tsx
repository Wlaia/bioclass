import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Change navbar style on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="BioClass Logo" className="h-[72px] w-auto object-contain" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/cursos" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        Cursos
                    </Link>
                    <Link to="/materiais" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        Materiais
                    </Link>
                    <Link to="/sobre" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        Sobre Nós
                    </Link>

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="hover:text-primary hover:bg-primary/5 font-medium">
                                Área do Aluno
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6">
                                Criar Conta
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl animate-accordion-down">
                    <Link to="/cursos" className="block text-sm font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700" onClick={() => setIsMenuOpen(false)}>
                        Cursos
                    </Link>
                    <Link to="/materiais" className="block text-sm font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700" onClick={() => setIsMenuOpen(false)}>
                        Materiais Digitais
                    </Link>
                    <Link to="/sobre" className="block text-sm font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700" onClick={() => setIsMenuOpen(false)}>
                        Sobre Nós
                    </Link>
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                        <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-center">Login</Button>
                        </Link>
                        <Link to="/register" className="w-full" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full justify-center rounded-full">Começar Agora</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
