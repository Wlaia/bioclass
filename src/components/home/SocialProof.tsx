import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Dra. Juliana Mendes",
        role: "Biomédica",
        content: "A didática dos professores é incrível. Consegui aplicar as técnicas de injetáveis logo na primeira semana após o curso. O retorno financeiro foi imediato!",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Carlos Eduardo",
        role: "Técnico em Análises",
        content: "A plataforma é muito fácil de usar e o suporte é excelente. O certificado validado fez total diferença na minha contratação pelo laboratório.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Fernanda Costa",
        role: "Esteticista",
        content: "Estava buscando atualização e encontrei na BioClass o melhor conteúdo. As aulas práticas em 4K mostram cada detalhe dos procedimentos.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
];

const stats = [
    { value: "15k+", label: "Alunos Formados" },
    { value: "4.8", label: "Nota Média", icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> },
    { value: "50+", label: "Cursos Disponíveis" },
    { value: "100%", label: "Aprovação no Mercado" }
];

export function SocialProof() {
    return (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 border-b border-gray-200 pb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-4xl lg:text-5xl font-extrabold text-primary mb-2 flex items-center justify-center gap-2">
                                {stat.value}
                                {stat.icon}
                            </div>
                            <div className="text-gray-500 font-medium uppercase tracking-wide text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">O que dizem nossos alunos</h2>
                    <p className="text-gray-600">
                        Milhares de profissionais já transformaram suas carreiras com a BioClass.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-warning fill-warning" />)}
                            </div>
                            <p className="text-gray-600 mb-6 italic leading-relaxed">"{t.content}"</p>
                            <div className="flex items-center gap-4">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                                    <p className="text-primary text-xs font-medium">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
