const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UTMIFY_URL = "https://api.utmify.com.br/api-credentials/orders";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = Deno.env.get("UTMIFY_API_TOKEN");
  if (!token) {
    return new Response(JSON.stringify({ error: "UTMIFY_API_TOKEN missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      orderId,
      status, // 'waiting_payment' | 'paid' | 'refused' | 'refunded' | 'chargedback'
      amountCents,
      customer,
      product,
      utm,
      createdAt,
      approvedAt,
    } = body;

    if (!orderId || !status || !amountCents || !customer || !product) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nowIso = () => new Date().toISOString().replace("T", " ").slice(0, 19);

    const ip =
      customer.ip ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";

    const payload = {
      orderId: String(orderId),
      platform: "LovableCheckout",
      paymentMethod: "pix",
      status,
      createdAt: createdAt || nowIso(),
      approvedDate: status === "paid" ? (approvedAt || nowIso()) : null,
      refundedAt: null,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || null,
        document: (customer.document || "").replace(/\D/g, ""),
        country: "BR",
        ip,
      },
      products: [
        {
          id: product.id || "default",
          name: product.name,
          planId: null,
          planName: null,
          quantity: product.quantity || 1,
          priceInCents: amountCents,
        },
      ],
      trackingParameters: {
        src: utm?.src || null,
        sck: utm?.sck || null,
        utm_source: utm?.utm_source || null,
        utm_campaign: utm?.utm_campaign || null,
        utm_medium: utm?.utm_medium || null,
        utm_content: utm?.utm_content || null,
        utm_term: utm?.utm_term || null,
      },
      commission: {
        totalPriceInCents: amountCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: amountCents,
      },
      isTest: false,
    };

    const res = await fetch(UTMIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": token,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.text();
    console.log(`Utmify ${status} ${res.status}:`, data);

    return new Response(JSON.stringify({ success: res.ok, status: res.status, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("utmify-order error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
