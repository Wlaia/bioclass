import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Banknote } from "lucide-react";
import { useState } from "react";
import type { CourseProps } from "@/components/shared/CourseCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: CourseProps | null;
    onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, course, onSuccess }: CheckoutModalProps) {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    // Chave Pix hardcoded
    const pixKey = "89c17ba0-37ed-4fac-ab80-b591c8802faa";

    const handleCopy = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmEnrollment = async () => {
        if (!course || !user) return;
        setLoading(true);

        try {
            // First check if enrollment already exists
            const { data: existing } = await supabase
                .from('enrollments')
                .select('*')
                .eq('user_id', user.id)
                .eq('course_id', course.id)
                .single();

            if (!existing) {
                // Insert new pending enrollment
                const { error } = await supabase
                    .from('enrollments')
                    .insert({
                        user_id: user.id,
                        course_id: course.id,
                        status: 'pending'
                    });

                if (error) throw error;
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Erro ao registrar intenção de matrícula:", error);
            alert("Houve um problema ao processar sua matrícula. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (!course) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-[500px] p-0 overflow-hidden bg-gray-50 rounded-2xl flex flex-col max-h-[90vh]">
                <div className="flex-1 overflow-y-auto flex flex-col">
                    <div className="p-6 pb-4 bg-white border-b shrink-0">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl font-bold">Resumo da Matrícula</DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                Sua matrícula ficará como <strong className="text-yellow-700">"Aguardando Confirmação"</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 flex gap-3 sm:gap-4 items-center p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{course.title}</h4>
                                <p className="text-[10px] sm:text-xs text-slate-500 mb-1 sm:mb-2">{course.duration} • {course.level}</p>
                                {user ? (
                                    <p className="text-base sm:text-lg font-bold text-green-600">
                                        {course.price ? `R$ ${course.price.toFixed(2)}` : "Grátis"}
                                    </p>
                                ) : (
                                    <p className="text-xs font-medium text-gray-400">Logue para ver valor</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-green-50/50 p-3 sm:p-4 flex items-center gap-3 border-b border-gray-100">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">Pagamento via PIX</h3>
                                    <p className="text-[10px] sm:text-xs text-gray-500">Liberação mediante comprovante</p>
                                </div>
                            </div>

                            <div className="p-3 sm:p-4">
                                <p className="text-[11px] sm:text-sm text-gray-600 mb-3 sm:mb-4">
                                    1. Copie a chave Pix e realize a transferência.<br />
                                    2. Envie o comprovante para liberação.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                    <code className="flex-1 bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-200 text-[10px] sm:text-sm font-mono truncate text-slate-700">
                                        {pixKey}
                                    </code>
                                    <Button size="sm" variant="secondary" onClick={handleCopy} className="h-9 sm:h-auto whitespace-nowrap">
                                        {copied ? <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? "Copiado!" : "Copiar Chave"}
                                    </Button>
                                </div>

                                <a
                                    href="https://wa.me/5524998361952"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-green-700 font-medium hover:text-green-800 bg-green-50 p-2.5 sm:p-3 rounded-lg border border-green-100 transition-colors"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                                    Enviar Comprovante
                                </a>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 p-3 sm:p-4 rounded-xl border border-blue-100 mx-4 sm:mx-6 mb-4 text-center shrink-0">
                            <p className="text-[10px] sm:text-xs text-blue-800 mb-2 leading-relaxed">
                                <strong>💳 Parcelamento ou Cartão?</strong><br />
                                Chame no WhatsApp! Enviamos o link de pagamento.
                            </p>
                            <a
                                href={`https://wa.me/5524998361952?text=${encodeURIComponent(`Olá! Gostaria de suporte com o pagamento do curso "${course.title}".`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs text-white font-medium bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                Dúvidas ou Cartão via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <div className="p-3 sm:p-4 border-t bg-white flex gap-2 sm:gap-3 flex-col sm:flex-row justify-end shrink-0">
                    <Button variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-32 h-10 sm:h-11">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            if (!user) {
                                onClose();
                                return;
                            }
                            handleConfirmEnrollment();
                        }}
                        disabled={loading}
                        className="w-full sm:w-48 bg-primary hover:bg-primary/90 text-white shadow-md h-10 sm:h-11 font-semibold"
                    >
                        {loading ? "Processando..." : user ? "Confirmar Pré-Inscrição" : "Login necessário"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
