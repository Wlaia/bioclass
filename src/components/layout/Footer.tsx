import { Mail, Phone, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="BioClass Logo" className="h-[60px] w-auto object-contain" />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Transformando carreiras na saúde através de educação de excelência, tecnologia e prática clínica avançada.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/bioclasscursos?igsh=ZWFrdG82czNubXZt&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>



                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">Fale Conosco</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>contato@bioclasscursos.com.br</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>(24) 99836-1952</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} BioClass Health Education. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-6">
                        <span>Desenvolvido por <a href="https://www.snappage.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">SnapPage</a></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
