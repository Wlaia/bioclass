import { useState } from "react";
import { CourseCard, type CourseProps } from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";

const coursesData: CourseProps[] = [
    {
        id: "1",
        title: "Biomedicina Estética Avançada",
        description: "Domine as técnicas de harmonização facial e tratamentos corporais com segurança.",
        image: "https://images.unsplash.com/photo-1576091160550-2187d80018fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Estética",
        duration: "120h",
        level: "Avançado",
        modules: 12,
        price: 997.00
    },
    {
        id: "2",
        title: "Microbiologia Clínica Laboratorial",
        description: "Aprenda a identificar patógenos e realizar diagnósticos precisos.",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Laboratório",
        duration: "80h",
        level: "Intermediário",
        modules: 8,
        price: 597.00
    },
    {
        id: "3",
        title: "Gestão de Clínicas e Consultórios",
        description: "Estratégias de gestão, marketing e vendas para profissionais da saúde.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Gestão",
        duration: "40h",
        level: "Iniciante",
        modules: 5,
        price: 297.00
    },
    {
        id: "4",
        title: "Toxina Botulínica e Preenchedores",
        description: "Curso prático focado em aplicação segura e resultados naturais.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Injetáveis",
        duration: "60h",
        level: "Avançado",
        modules: 10,
        price: 1297.00
    },
    {
        id: "5",
        title: "Imersão Presencial: Harmonização Full Face",
        description: "3 dias intensivos de prática em pacientes reais em nossa clínica escola.",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Presencial",
        duration: "30h",
        level: "Avançado",
        modules: 1,
        price: 2497.00
    },
    {
        id: "6",
        title: "Workshop Prático de Coleta Sanguínea",
        description: "Treinamento hands-on para aperfeiçoamento de técnicas de coleta.",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Presencial",
        duration: "8h",
        level: "Iniciante",
        modules: 1,
        price: 197.00
    }
];

const categories = ["Todos", "Presencial", "Estética", "Laboratório", "Biomedicina", "Injetáveis", "Gestão"];

export function FeaturedCourses() {
    const [activeCategory, setActiveCategory] = useState("Todos");

    const filteredCourses = activeCategory === "Todos"
        ? coursesData
        : coursesData.filter(c => c.category === activeCategory);

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold uppercase tracking-wider text-sm">Catálogo Completo</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Cursos em Destaque</h2>
                        <p className="text-gray-600 mt-4">
                            Explore nossos cursos mais populares e comece a transformar sua carreira hoje mesmo.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course.id} className="h-full">
                                <CourseCard course={course} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            Nenhum curso encontrado nesta categoria.
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <Button variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-white">
                        Ver Catálogo Completo
                    </Button>
                </div>
            </div>
        </section>
    );
}
