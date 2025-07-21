import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10", // ou sua versão da API do Stripe
});

export async function POST(req) {
  try {
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: body.items.map((item) => ({
        price_data: {
          currency: item.price_data.currency,
          product_data: item.price_data.product_data,
          unit_amount: item.price_data.unit_amount,
        },
        quantity: item.quantity,
      })),
      mode: body.mode || "payment",
      success_url: `${req.headers.get("origin")}/sucesso`,
      cancel_url: `${req.headers.get("origin")}/`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Erro no checkout:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
