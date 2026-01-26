import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, PlayCircle, Lock, CheckCircle2, FileText, MessageSquare, Share2, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export function CoursePlayer() {
    const { courseId } = useParams();
    const [activeTab, setActiveTab] = useState<"content" | "materials" | "comments">("content");

    const modules = [
        {
            id: 1,
            title: "Introdução à Biomedicina Estética",
            lessons: [
                { id: 101, title: "Boas vindas e Visão Geral", duration: "05:20", completed: true, current: false },
                { id: 102, title: "Histórico da Estética no Brasil", duration: "12:15", completed: true, current: false },
                { id: 103, title: "Áreas de Atuação e Legislação do Biomédico", duration: "18:40", completed: false, current: true },
            ]
        },
        {
            id: 2,
            title: "Anatomia Facial Aplicada",
            lessons: [
                { id: 201, title: "Músculos da Face", duration: "25:00", completed: false, current: false },
                { id: 202, title: "Vascularização e Nervos", duration: "22:15", completed: false, current: false },
                { id: 203, title: "Zonas de Perigo", duration: "15:30", completed: false, current: false },
            ]
        }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] -m-6 md:-m-8">
            {/* Player Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center gap-4">
                <Link to="/student">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-sm md:text-base font-bold line-clamp-1">Biomedicina Estética Avançada</h1>
                    <p className="text-xs text-gray-400">Módulo 1: Introdução • Aula 3/10</p>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Video) */}
                <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100">
                    <div className="aspect-video bg-black w-full relative">
                        {/* Placeholder for Video Player */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-20 h-20 text-white/20" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h2 className="text-white font-bold text-lg md:text-xl">Áreas de Atuação e Legislação</h2>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-0 mb-6">
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setActiveTab("content")}
                                    className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "content" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-900"}`}
                                >
                                    Descrição
                                </button>
                                <button
                                    onClick={() => setActiveTab("materials")}
                                    className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "materials" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-900"}`}
                                >
                                    Materiais <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5">2</Badge>
                                </button>
                                <button
                                    onClick={() => setActiveTab("comments")}
                                    className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-900"}`}
                                >
                                    Dúvidas
                                </button>
                            </div>
                            <div className="hidden md:flex gap-2 pb-2">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Share2 className="w-4 h-4" /> Compartilhar
                                </Button>
                            </div>
                        </div>

                        {activeTab === "content" && (
                            <div className="animate-fade-in space-y-4 max-w-3xl">
                                <h3 className="font-bold text-lg text-gray-900">Sobre esta aula</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Nesta aula, abordaremos as principais resoluções do Conselho Federal de Biomedicina que regulamentam a atuação do profissional na área estética. Entenda seus direitos, deveres e limites de atuação para trabalhar com segurança jurídica.
                                </p>
                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                                    <strong>Atenção:</strong> Conteúdo atualizado conforme Resolução CFBM nº 307/2019.
                                </div>
                            </div>
                        )}

                        {activeTab === "materials" && (
                            <div className="animate-fade-in space-y-4 max-w-3xl">
                                <h3 className="font-bold text-lg text-gray-900">Materiais Complementares</h3>
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary/30 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">Resumo da Legislação em Estética</p>
                                            <p className="text-xs text-gray-500">PDF • 2.5 MB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon"><Download className="w-5 h-5 text-gray-400" /></Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "comments" && (
                            <div className="animate-fade-in text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-gray-900">Nenhuma dúvida ainda</h3>
                                <p className="text-gray-500 text-sm mt-1">Seja o primeiro a perguntar sobre esta aula!</p>
                                <Button className="mt-4" variant="outline">Fazer uma pergunta</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Playlist) */}
                <div className="w-80 md:w-96 bg-white border-l border-gray-200 flex flex-col hidden lg:flex">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-900">Conteúdo do Curso</h3>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>30% Concluído</span>
                            <span>3/10 Aulas</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-green-500 w-[30%]"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {modules.map((module) => (
                            <div key={module.id} className="border-b border-gray-100">
                                <div className="p-4 bg-gray-50/50 font-bold text-sm text-gray-900 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                                    {module.title}
                                </div>
                                <div>
                                    {module.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${lesson.current ? "bg-primary/5 border-primary" : "border-transparent"
                                                }`}
                                        >
                                            <div className="pt-1">
                                                {lesson.completed ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : lesson.current ? (
                                                    <PlayCircle className="w-4 h-4 text-primary fill-primary/10" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${lesson.current ? "text-primary" : "text-gray-700"}`}>
                                                    {lesson.title}
                                                </p>
                                                <span className="text-xs text-gray-400 mt-1 block">{lesson.duration}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
