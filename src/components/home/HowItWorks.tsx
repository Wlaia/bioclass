import { UserPlus, Search, Play, Award, CheckCircle2 } from "lucide-react";

const steps = [
    {
        id: 1,
        icon: <UserPlus className="w-6 h-6" />,
        title: "Crie sua conta",
        text: "Cadastro rápido e gratuito para acessar a plataforma."
    },
    {
        id: 2,
        icon: <Search className="w-6 h-6" />,
        title: "Escolha seu curso",
        text: "Navegue pelo nosso catálogo de cursos especializados."
    },
    {
        id: 3,
        icon: <Play className="w-6 h-6" />,
        title: "Assista às aulas",
        text: "Aprenda com conteúdo prático e direto ao ponto."
    },
    {
        id: 4,
        icon: <Award className="w-6 h-6" />,
        title: "Receba o certificado",
        text: "Ao final, emita seu certificado válido em todo país."
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            Sua jornada para o <br />
                            <span className="text-primary">sucesso profissional</span> começa aqui
                        </h2>
                        <p className="text-lg text-gray-600">
                            Simplificamos o processo de aprendizado para você focar no que importa: sua evolução.
                        </p>

                        <div className="space-y-6">
                            {steps.map((step) => (
                                <div key={step.id} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-lg">
                                        {step.id}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                            {step.title}
                                            {step.id === 4 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        </h4>
                                        <p className="text-sm text-gray-500">{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        {/* Abstract decoration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl transform rotate-12 scale-75" />

                        <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 max-w-md mx-auto">
                            <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
                                    alt="Estudante BioClass"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <p className="text-sm font-medium opacity-80 mb-2">Depoimento</p>
                                    <p className="text-lg font-bold leading-snug">"O melhor investimento que fiz na minha carreira. Aulas didáticas e aplicação imediata."</p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">D</div>
                                        <div>
                                            <p className="text-sm font-bold">Dra. Ana Silva</p>
                                            <p className="text-xs opacity-70">Biomédica Esteta</p>
                                        </div>
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
