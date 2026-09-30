import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LineItemInput {
  name: string;
  amount_eur: number;
  quantity: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("COOUD_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "COOUD_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const items: LineItemInput[] = body.line_items || [];
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "line_items required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const line_items = items.map((it) => ({
      name: String(it.name).slice(0, 120),
      amount: Math.round(Number(it.amount_eur) * 100),
      currency: "eur",
      quantity: Math.max(1, Math.min(99, Math.round(Number(it.quantity) || 1))),
      delivery: { mode: "external" },
    }));

    const payload: Record<string, unknown> = {
      line_items,
      success_url: body.success_url,
      cancel_url: body.cancel_url,
      ui_mode: "hosted",
    };
    if (body.customer_email) payload.customer_email = body.customer_email;
    if (body.metadata && typeof body.metadata === "object") {
      payload.metadata = body.metadata;
    }

    const res = await fetch("https://api.cooud.com/v2/checkout-sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Cooud-Compat-Date": "2026-09-01",
        "Idempotency-Key": crypto.randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Cooud error", res.status, JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: data?.error?.message || data?.message || "cooud_error", status: res.status }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let url: string = data.url;
    // Hosted checkout lives on checkout.cooud.com (live) / checkout-sandbox.cooud.com (sandbox).
    if (url?.startsWith("https://cooud.com/")) {
      const host = data.livemode === false ? "checkout-sandbox.cooud.com" : "checkout.cooud.com";
      url = url.replace("https://cooud.com/", `https://${host}/`);
    }

    return new Response(JSON.stringify({ url, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("cooud-checkout error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
