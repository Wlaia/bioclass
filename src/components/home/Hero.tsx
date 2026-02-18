import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
    return (
        <section className="relative pt-32 pb-32 overflow-hidden bg-white">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-[30rem] h-[30rem] bg-accent/30 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in">
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">Domine a Hematologia</span> na prática laboratorial!
                        </h1>

                        <div className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 space-y-4">
                            <p>
                                Aprenda a interpretar o hemograma completo, identificar alterações hematológicas e ganhar segurança na liberação de resultados.
                            </p>
                            <p className="font-medium text-gray-800">
                                📊 Curso prático, didático e focado na rotina real do laboratório.
                            </p>
                            <div className="bg-white/50 p-4 rounded-lg border border-primary/10 inline-block text-left w-full space-y-2">
                                <p className="font-semibold text-gray-800 flex items-center gap-2">
                                    <span>📅</span> 08 de Março às 9h
                                </p>
                                <p className="font-semibold text-gray-800 flex items-center gap-2">
                                    <span>📍</span> Faculdade FAEL - Centro Angra dos Reis
                                </p>
                            </div>
                            <p>
                                Garanta sua vaga e desenvolva habilidades essenciais com aprendizado completo, orientação especializada e foco no mercado de trabalho.
                            </p>
                            <p className="font-bold text-primary">
                                ✨ Vagas limitadas — inscreva-se agora!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full transition-all hover:scale-105 active:scale-95">
                                    Inscreva-se Agora <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative animate-slide-up animation-delay-300">
                        <div className="relative rounded-2xl p-2 bg-white/50 backdrop-blur-xl border border-white/40 shadow-2xl">
                            <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video shadow-inner relative">
                                <img
                                    src="https://images.unsplash.com/photo-1628595351029-c2bf17511435?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Curso de Hematologia"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
