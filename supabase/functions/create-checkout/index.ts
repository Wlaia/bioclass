
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MercadoPagoConfig, Preference } from 'npm:mercadopago'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { course_id, price, title } = await req.json()

        // Initialize Mercado Pago
        // client is initialized with the Access Token
        const client = new MercadoPagoConfig({
            accessToken: Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || '',
            options: { timeout: 5000 }
        });

        const preference = new Preference(client);

        const body = {
            items: [
                {
                    id: course_id,
                    title: title,
                    quantity: 1,
                    unit_price: Number(price),
                    currency_id: 'BRL',
                },
            ],
            back_urls: {
                success: 'https://bioclass.com.br/student/payment/success', // Update with actual domain
                failure: 'https://bioclass.com.br/student/payment/failure',
                pending: 'https://bioclass.com.br/student/payment/pending',
            },
            auto_return: 'approved',
        };

        const response = await preference.create({ body });

        return new Response(
            JSON.stringify({ init_point: response.init_point, id: response.id }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        )
    }
})
