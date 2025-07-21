"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: "Chaveiro Ursinho Fofo",
              },
              unit_amount: 1500,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro ao redirecionar para o Stripe");
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Finalizar Compra</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        {loading ? "Redirecionando..." : "Pagar com cartão"}
      </button>
    </div>
  );
}
