
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CourseCard, type CourseProps } from "@/components/shared/CourseCard";
import { useNavigate } from "react-router-dom";

export function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<CourseProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Todos");

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formattedCourses: CourseProps[] = data.map(course => ({
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    image: course.image_url,
                    category: course.category,
                    duration: course.duration,
                    level: course.level,
                    modules: course.modules_count,
                    price: course.price
                }));
                setCourses(formattedCourses);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredCourses = filter === "Todos"
        ? courses
        : courses.filter(course => course.category === filter);

    const categories = ["Todos", ...Array.from(new Set(courses.map(c => c.category)))];

    return (
        <div className="py-12 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Nossos Cursos</h1>
                    <p className="text-lg text-muted-foreground">
                        Explore nossa seleção de cursos de alta qualidade, desenvolvidos por especialistas para impulsionar sua carreira na saúde.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Carregando cursos...</div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Nenhum curso encontrado.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="h-full">
                                <CourseCard
                                    course={course}
                                    variant="enroll"
                                    onEnroll={() => navigate("/student")}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
