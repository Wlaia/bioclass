
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MercadoPagoButtonProps {
    courseId: string;
    price: number;
    title: string;
    buttonText?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function MercadoPagoButton({ courseId, price, title, buttonText = "Comprar Agora", variant = "default" }: MercadoPagoButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleBuy() {
        try {
            setLoading(true);

            // 1. Call Supabase Function to create preference
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    course_id: courseId,
                    price: price, // Ensure this is a number
                    title: title
                }
            });

            if (error) {
                console.error('Error creating checkout:', error);
                throw error;
            }

            if (data?.init_point) {
                // 2. Redirect to Mercado Pago
                window.location.href = data.init_point;
            } else {
                throw new Error('No init_point returned');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Erro ao iniciar pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button onClick={handleBuy} disabled={loading} variant={variant} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {buttonText}
        </Button>
    );
}
