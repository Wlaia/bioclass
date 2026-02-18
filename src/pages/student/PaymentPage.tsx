import { Button } from "@/components/ui/button";
import { CheckCircle, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function PaymentPage() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // Chave Pix hardcoded conforme solicitado
    // Chave Pix hardcoded conforme solicitado
    const pixKey = "8ba6e4d7-058e-4fc0-8ea6-33c52960b695";

    const handleCopy = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-green-50 p-8 text-center border-b border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-green-800 mb-2">Inscrição Realizada!</h1>
                    <p className="text-green-700">Para liberar seu acesso, realize o pagamento via Pix.</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Pagamento via Pix</h2>
                        <p className="text-gray-500">
                            Copie o código abaixo e cole no aplicativo do seu banco para finalizar o pagamento.
                            Seu acesso será liberado automaticamente após a confirmação.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 break-all relative group">
                        <p className="font-mono text-sm text-gray-600 mb-2">Chave Pix (Copia e Cola):</p>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-500 font-mono">
                            {pixKey}
                        </div>
                        <Button
                            className="w-full mt-4 gap-2"
                            onClick={handleCopy}
                            variant={copied ? "default" : "outline"}
                        >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copiado!" : "Copiar Chave Pix"}
                        </Button>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 pt-6">
                        <h3 className="font-medium text-gray-900">Próximos passos:</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex gap-2">
                                <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                Realize o pagamento usando a chave acima.
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                <div>
                                    Envie o comprovante para o WhatsApp <br />
                                    <a
                                        href="https://wa.me/5524992777262"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 font-semibold hover:underline"
                                    >
                                        (24) 99277-7262
                                    </a>
                                </div>
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                Aguarde a liberação do seu acesso.
                            </li>
                        </ul>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button onClick={() => navigate("/student")} variant="link" className="text-gray-500">
                            Voltar para o Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
