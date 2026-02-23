import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Award, Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Certificate() {
    const { id } = useParams<{ id: string }>(); // enrollment Id
    const navigate = useNavigate();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchCertificateData();
    }, [id]);

    async function fetchCertificateData() {
        try {
            // Fetch enrollment + user profile + course info
            const { data: enrollment, error: enrollmentError } = await supabase
                .from('enrollments')
                .select(`
                    id, enrolled_at, status,
                    course_id
                `)
                .eq('id', id)
                .single();

            if (enrollmentError) throw enrollmentError;

            // To get profile data, we need the user session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, cpf')
                .eq('id', session.user.id)
                .single();

            const { data: course } = await supabase
                .from('courses')
                .select('title, duration')
                .eq('id', enrollment.course_id)
                .single();

            if (profile && course) {
                // Here we simulate a completion date. In a real app we'd have it in the DB.
                const completionDate = new Date().toLocaleDateString('pt-BR');

                setData({
                    studentName: profile.full_name,
                    studentCpf: profile.cpf || "000.000.000-00",
                    courseName: course.title,
                    workload: course.duration || "40h",
                    date: completionDate,
                    certificateCode: enrollment.id.split('-')[0].toUpperCase() // short code
                });
            } else {
                navigate('/student');
            }
        } catch (error) {
            console.error("Erro ao gerar certificado:", error);
            navigate('/student');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">Gerando seu certificado...</div>;
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">

            {/* Top Bar for Actions (Hidden when printing) */}
            <div className="w-full max-w-[1100px] flex justify-between items-center mb-6 print:hidden">
                <Button variant="outline" className="text-white hover:text-white border-white/20 hover:bg-white/10" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button onClick={() => window.print()} className="bg-primary hover:bg-primary/90 shadow-lg text-white px-6">
                    <Printer className="w-4 h-4 mr-2" /> Salvar / Imprimir PDF
                </Button>
            </div>

            {/* Certificate Container - Fixed aspect ratio A4 Landscape style */}
            <div className="relative w-full max-w-[1100px] aspect-[1.414/1] bg-white shadow-2xl print:shadow-none print:w-full print:h-full overflow-hidden">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#004c4c 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
                </div>

                {/* Elegant Borders */}
                <div className="absolute inset-4 border-[6px] border-[#d4af37] opacity-80 z-10 pointer-events-none"></div>
                <div className="absolute inset-6 border-[1px] border-[#d4af37] opacity-50 z-10 pointer-events-none"></div>

                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-12 sm:px-24">

                    {/* Header */}
                    <div className="mb-8">
                        {/* Bioclass Logo Alternative (Text based for printing reliability) */}
                        <div className="flex items-center justify-center gap-3 text-primary mb-6">
                            <Award className="w-12 h-12 text-[#d4af37]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-serif text-slate-800 tracking-widest font-bold uppercase">
                            Certificado de Conclusão
                        </h1>
                        <div className="w-32 h-1 bg-[#d4af37] mx-auto mt-6"></div>
                    </div>

                    {/* Main Text */}
                    <div className="space-y-6 max-w-3xl">
                        <p className="text-lg sm:text-xl text-slate-600 font-medium tracking-wide">
                            Certificamos para os devidos fins que
                        </p>

                        <h2 className="text-5xl sm:text-7xl text-primary mt-4 mb-4" style={{ fontFamily: "'Great Vibes', cursive" }}>
                            {data.studentName}
                        </h2>

                        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
                            portador(a) do CPF <strong className="font-semibold">{data.studentCpf}</strong>, concluiu com êxito o treinamento <br />
                            <span className="text-2xl font-bold text-slate-900 block my-3 font-serif">"{data.courseName}"</span>
                            com carga horária total de <strong className="font-semibold">{data.workload}</strong>.
                        </p>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="w-full flex justify-between items-end mt-16 px-12">
                        <div className="text-center w-64">
                            <p className="text-sm font-semibold text-slate-700 mb-1">{data.date}</p>
                            <div className="w-full h-px bg-slate-400 mb-2"></div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Data de Emissão</p>
                        </div>

                        {/* Gold Seal & QR Code */}
                        <div className="flex items-center gap-12 relative">
                            {/* QR Code Placeholder */}
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white p-1 border border-slate-200">
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm-3-3h2v2h-2v-2zm0 3h2v2h-2v-2z" /></svg>
                                    </div>
                                </div>
                                <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-tighter">Validar Certificado</p>
                            </div>

                            {/* Luxury Gold Seal */}
                            <div className="flex flex-col items-center justify-center relative">
                                <div className="w-28 h-28 rounded-full border-4 border-[#d4af37] bg-gradient-to-br from-yellow-50 to-yellow-200 flex items-center justify-center shadow-lg relative z-10">
                                    <div className="absolute inset-1 border border-[#d4af37] rounded-full opacity-30"></div>
                                    <Award className="w-14 h-14 text-[#d4af37]" />
                                </div>
                                {/* Decorative Ribbons */}
                                <div className="absolute -bottom-4 -left-2 w-8 h-12 bg-[#c9a32c] -z-10 skew-x-[15deg] shadow-sm"></div>
                                <div className="absolute -bottom-4 -right-2 w-8 h-12 bg-[#c9a32c] -z-10 -skew-x-[15deg] shadow-sm"></div>
                                <p className="text-[10px] text-slate-400 mt-6 text-center font-semibold">Registro: {data.certificateCode}<br />BioClass Oficiante</p>
                            </div>
                        </div>

                        <div className="text-center w-64">
                            <div className="h-12 w-full flex items-center justify-center mb-1">
                                {/* Simulating a stylish signature */}
                                <span className="text-3xl text-slate-800/80 -rotate-3" style={{ fontFamily: "'Great Vibes', cursive" }}>BioClass Diretoria</span>
                            </div>
                            <div className="w-full h-px bg-slate-400 mb-2"></div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Direção / Coordenação</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:w-full { width: 100vw !important; max-width: none !important; }
                    .print\\:h-full { height: 100vh !important; }
                }
            `}</style>
        </div>
    );
}
