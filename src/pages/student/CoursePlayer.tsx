import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, PlayCircle, MessageSquare, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Lesson {
    id: string;
    title: string;
    duration: string;
    video_url: string | null;
    completed?: boolean; // Mocked for now
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export function CoursePlayer() {
    const { courseId } = useParams();
    const [activeTab, setActiveTab] = useState<"content" | "materials" | "comments">("content");
    const [modules, setModules] = useState<Module[]>([]);
    const [courseTitle, setCourseTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        if (courseId) {
            fetchCourseContent(courseId);
        }
    }, [courseId]);

    async function fetchCourseContent(id: string) {
        setLoading(true);
        try {
            // 1. Fetch Course Details
            const { data: course, error: courseError } = await supabase
                .from("courses")
                .select("title")
                .eq("id", id)
                .single();

            if (courseError) throw courseError;
            setCourseTitle(course.title);

            // 2. Fetch Modules
            const { data: modulesData, error: modulesError } = await supabase
                .from("modules")
                .select("*")
                .eq("course_id", id)
                .order("order_index");

            if (modulesError) throw modulesError;

            // 3. Fetch Lessons for all modules
            const moduleIds = modulesData.map(m => m.id);
            const { data: lessonsData, error: lessonsError } = await supabase
                .from("lessons")
                .select("*")
                .in("module_id", moduleIds)
                .order("order_index");

            if (lessonsError) throw lessonsError;

            // 4. Assemble Structure
            const structuredModules = modulesData.map(mod => ({
                ...mod,
                lessons: lessonsData.filter(l => l.module_id === mod.id)
            }));

            setModules(structuredModules);

            // Set initial lesson
            if (structuredModules.length > 0 && structuredModules[0].lessons.length > 0) {
                setCurrentLesson(structuredModules[0].lessons[0]);
            }

        } catch (error) {
            console.error("Error fetching course content:", error);
        } finally {
            setLoading(false);
        }
    }

    // Save progress when lesson is watched
    useEffect(() => {
        if (currentLesson && courseId) {
            saveProgress(currentLesson.id);
        }
    }, [currentLesson?.id]);

    async function saveProgress(lessonId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('lesson_progress')
                .upsert({
                    user_id: user.id,
                    lesson_id: lessonId,
                    course_id: courseId,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id, lesson_id' });

        } catch (error) {
            console.error("Error saving progress:", error);
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando aula...</div>;
    }

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
                    <h1 className="text-sm md:text-base font-bold line-clamp-1">{courseTitle}</h1>
                    <p className="text-xs text-gray-400">
                        {currentLesson ? currentLesson.title : "Selecione uma aula"}
                    </p>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Video) */}
                <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100">
                    <div className="aspect-video bg-black w-full relative">
                        {currentLesson?.video_url ? (
                            <iframe
                                src={currentLesson.video_url}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                                <PlayCircle className="w-20 h-20 text-white/20" />
                                <p className="text-white/50">Selecione uma aula para assistir</p>
                            </div>
                        )}

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
                                    Materiais <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5">0</Badge>
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
                                    {currentLesson?.title || "Selecione uma aula para ver a descrição."}
                                </p>
                            </div>
                        )}

                        {activeTab === "materials" && (
                            <div className="animate-fade-in space-y-4 max-w-3xl">
                                <h3 className="font-bold text-lg text-gray-900">Materiais Complementares</h3>
                                <p className="text-gray-500 text-sm">Nenhum material disponível para esta aula.</p>
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
                            <span>0% Concluído</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-green-500 w-[0%]"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {modules.map((module) => (
                            <div key={module.id} className="border-b border-gray-100">
                                <div className="p-4 bg-gray-50/50 font-bold text-sm text-gray-900 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                                    {module.title}
                                </div>
                                <div>
                                    {module.lessons.map((lesson) => {
                                        const isCurrent = currentLesson?.id === lesson.id;
                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setCurrentLesson(lesson)}
                                                className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${isCurrent ? "bg-primary/5 border-primary" : "border-transparent"
                                                    }`}
                                            >
                                                <div className="pt-1">
                                                    {isCurrent ? (
                                                        <PlayCircle className="w-4 h-4 text-primary fill-primary/10" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-gray-700"}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <span className="text-xs text-gray-400 mt-1 block">{lesson.duration}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
