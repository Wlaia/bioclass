import { Button } from "@/components/ui/button";


const MOCKED_COURSES = [
    {
        id: 1,
        title: "Biomedicina Estética Avançada",
        instructor: "Dra. Ana Silva",
        level: "Avançado",
        duration: "40h",
        price: "R$ 1.290,00",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        category: "Estética",
        description: "Domine as técnicas mais avançadas em procedimentos estéticos minimamente invasivos."
    },
    {
        id: 2,
        title: "Hematologia Clínica Laboratorial",
        instructor: "Dr. Carlos Santos",
        level: "Intermediário",
        duration: "60h",
        price: "R$ 890,00",
        image: "https://images.unsplash.com/photo-1532938911079-1de297f9723d?auto=format&fit=crop&w=800&q=80",
        category: "Análises Clínicas",
        description: "Interpretação completa de hemogramas e patologias associadas."
    },
    {
        id: 3,
        title: "Gestão e Marketing para Clínicas",
        instructor: "Prof. Marcos Lima",
        level: "Básico",
        duration: "20h",
        price: "R$ 450,00",
        image: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=800&q=80",
        category: "Gestão",
        description: "Aprenda a administrar seu consultório e atrair mais pacientes."
    },
    {
        id: 4,
        title: "Microbiologia Clínica",
        instructor: "Dra. Fernanda Oliveira",
        level: "Avançado",
        duration: "50h",
        price: "R$ 950,00",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
        category: "Análises Clínicas",
        description: "Identificação bacteriana e testes de sensibilidade a antimicrobianos."
    },
    {
        id: 5,
        title: "Harmonização Facial Integrativa",
        instructor: "Dra. Juliana Costa",
        level: "Especialista",
        duration: "80h",
        price: "R$ 2.500,00",
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
        category: "Estética",
        description: "Abordagem completa para harmonização facial com segurança e resultados naturais."
    },
    {
        id: 6,
        title: "Citopatologia Oncótica",
        instructor: "Dr. Roberto Almeida",
        level: "Avançado",
        duration: "45h",
        price: "R$ 1.100,00",
        image: "https://images.unsplash.com/photo-1576091160550-2187d819d946?auto=format&fit=crop&w=800&q=80",
        category: "Análises Clínicas",
        description: "Diagnóstico citológico de lesões pré-neoplásicas e neoplásicas."
    }
];

export function Courses() {
    return (
        <div className="py-12 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Nossos Cursos</h1>
                    <p className="text-lg text-muted-foreground">
                        Explore nossa seleção de cursos de alta qualidade, desenvolvidos por especialistas para impulsionar sua carreira na saúde.
                    </p>
                </div>

                {/* Filters (Mocked) */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {["Todos", "Estética", "Análises Clínicas", "Gestão", "Imaginologia"].map((filter) => (
                        <button
                            key={filter}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'Todos' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCKED_COURSES.map((course) => (
                        <div key={course.id} className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-shadow group flex flex-col">
                            <div className="relative h-56 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                    style={{ backgroundImage: `url(${course.image})` }}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                                    {course.category}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{course.level}</span>
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">⏱ {course.duration}</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                    {course.description}
                                </p>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                                    <span className="text-sm font-medium text-slate-700">{course.instructor}</span>
                                </div>

                                <div className="pt-4 border-t flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="block text-xs text-slate-500">Investimento</span>
                                        <span className="text-lg font-bold text-primary">{course.price}</span>
                                    </div>
                                    <Button>Matricule-se</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
