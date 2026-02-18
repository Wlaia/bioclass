import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";

export function UpcomingCourse() {
    return (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-gray-100/50 border border-gray-100">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                            <CalendarClock className="w-4 h-4" />
                            Em Breve
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Curso Completo de Coleta
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Prepare-se para dominar as melhores técnicas de coleta sanguínea com segurança e eficiência.
                            Uma formação prática essencial para sua carreira na área da saúde.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button variant="outline" size="lg" className="rounded-full h-12 px-8" disabled>
                                Aguarde Novas Turmas
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-gray-100 group">
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 group-hover:bg-black/50 transition-all">
                                <span className="text-white font-bold text-xl tracking-wider border-2 border-white/30 px-6 py-3 rounded-lg backdrop-blur-sm">
                                    EM BREVE
                                </span>
                            </div>
                            <img
                                src="/hero-collection.png"
                                alt="Curso de Coleta - Em Breve"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
