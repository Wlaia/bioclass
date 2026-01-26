import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-[30rem] h-[30rem] bg-accent/30 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in">
                        <Badge variant="outline" className="px-4 py-1.5 text-primary border-primary/20 bg-primary/5 rounded-full text-sm font-medium mb-4 inline-flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Plataforma #1 em Saúde e Estética
                        </Badge>

                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                            Transforme sua Carreira com Cursos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">Presenciais e Online</span>
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Domine as técnicas mais avançadas em Biomedicina, Análises Clínicas e Procedimentos Estéticos. Certificação reconhecida e aulas práticas de alta qualidade.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full transition-all hover:scale-105 active:scale-95">
                                    Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/cursos">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base border-gray-200 hover:bg-white hover:text-primary hover:border-primary/30 rounded-full gap-2 transition-all">
                                    <PlayCircle className="w-5 h-5" />
                                    Ver Cursos
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span>Certificado Validado</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span>Metodologia Prática</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative animate-slide-up animation-delay-300">
                        <div className="relative rounded-2xl p-2 bg-white/50 backdrop-blur-xl border border-white/40 shadow-2xl">
                            <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video shadow-inner relative group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Plataforma BioClass"
                                    className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-75"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                        <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                                    </div>
                                </div>

                                {/* Floating Badges */}
                                <div className="absolute -left-6 top-10 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-float-slow">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">
                                        +5k
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-gray-900">Alunos Formados</p>
                                        <p className="text-gray-500">em todo Brasil</p>
                                    </div>
                                </div>

                                <div className="absolute -right-6 bottom-10 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-float-slow animation-delay-1500">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-gray-900">Certificado</p>
                                        <p className="text-gray-500">Reconhecido</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
