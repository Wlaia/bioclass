import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="BioClass Logo" className="h-[60px] w-auto object-contain" />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Transformando carreiras na saúde através de educação de excelência, tecnologia e prática clínica avançada.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">Cursos Populares</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Biomedicina Estética</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Hematologia Clínica</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Microbiologia Avançada</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Gestão Laboratorial</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Farmacologia Aplicada</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">Institucional</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Sobre a BioClass</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Nossos Professores</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Validação de Certificado</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">Fale Conosco</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>Av. Paulista, 1000, 15º Andar<br />Bela Vista, São Paulo - SP</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>contato@bioclass.edu.br</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>(11) 4002-8922</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} BioClass Health Education. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-6">
                        <span>Desenvolvido com tecnologia de ponta</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
