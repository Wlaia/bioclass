import { Award, Clock, Laptop, MonitorPlay, Users } from "lucide-react";

const differentials = [
    {
        icon: <Award className="w-8 h-8 text-primary" />,
        title: "Certificação Premium",
        description: "Certificados com validação digital aceitos em todo território nacional."
    },
    {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "Aulas Práticas Presenciais",
        description: "Vivência real em laboratórios modernos e supervisão direta de especialistas."
    },
    {
        icon: <Laptop className="w-8 h-8 text-primary" />,
        title: "Plataforma Híbrida",
        description: "Una o melhor do ensino online com a prática presencial para sua formação."
    },
    {
        icon: <MonitorPlay className="w-8 h-8 text-primary" />,
        title: "Conteúdo Online 4K",
        description: "Revise a teoria quantas vezes quiser com aulas gravadas em alta definição."
    }
];

export function Differentials() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher a BioClass?</h2>
                    <p className="text-gray-600">
                        Nossa metodologia une teoria científica atualizada com a prática que o mercado exige.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {differentials.map((item, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
