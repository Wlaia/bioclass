import { Button } from "@/components/ui/button";
import { Book, Download, FileText, ShoppingBag } from "lucide-react";

const materials = [
    {
        id: 1,
        title: "Guia Completo de Harmonização Facial",
        type: "Ebook Digital",
        pages: 120,
        price: 49.90,
        icon: <Book className="w-6 h-6" />
    },
    {
        id: 2,
        title: "Protocolos de Coleta Laboratorial",
        type: "PDF Técnico",
        pages: 45,
        price: 29.90,
        icon: <FileText className="w-6 h-6" />
    },
    {
        id: 3,
        title: "Manual de Biossegurança 2024",
        type: "Guia Prático",
        pages: 80,
        price: 39.90,
        icon: <Download className="w-6 h-6" />
    }
];

export function MaterialsSection() {
    return (
        <section className="py-24 bg-primary text-white relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-4 backdrop-blur-sm">
                                Biblioteca Digital
                            </span>
                            <h2 className="text-4xl font-bold leading-tight">
                                Acelere seus estudos com nossos <span className="text-accent underline decoration-4 underline-offset-4">Materiais Exclusivos</span>
                            </h2>
                        </div>
                        <p className="text-lg text-white/80 leading-relaxed">
                            Acesse guias, protocolos e e-books desenvolvidos por especialistas para complementar sua formação e consultar no dia a dia da clínica.
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full shadow-xl">
                            Acessar Biblioteca
                        </Button>
                    </div>

                    <div className="grid gap-6">
                        {materials.map((item) => (
                            <div key={item.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 flex items-center justify-between hover:bg-white/15 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-white/60 text-sm">{item.type} • {item.pages} páginas</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold">R$ {item.price.toFixed(2)}</p>
                                    <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/20 p-0 h-auto font-medium mt-1">
                                        Comprar <ShoppingBag className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
