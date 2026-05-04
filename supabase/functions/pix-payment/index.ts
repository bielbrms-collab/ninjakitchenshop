const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const KIRVUS_PUBLIC = Deno.env.get("KIRVUSPAY_PUBLIC_KEY");
const KIRVUS_SECRET = Deno.env.get("KIRVUSPAY_SECRET_KEY");
const KIRVUS_BASE = "https://app.kirvuspay.com.br/api/v1";

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { error: text || `HTTP ${res.status}` }; }
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeStatus(raw: string): string {
  const s = (raw || "").toString().toUpperCase();
  if (["COMPLETED", "PAID", "APPROVED", "OK"].includes(s)) return "COMPLETED";
  if (["FAILED", "REJECTED", "CANCELED", "CANCELLED", "REFUNDED", "CHARGED_BACK", "EXPIRED"].includes(s)) return "FAILED";
  return "PENDING";
}

function authHeaders() {
  return {
    "x-public-key": KIRVUS_PUBLIC!,
    "x-secret-key": KIRVUS_SECRET!,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (!KIRVUS_PUBLIC || !KIRVUS_SECRET) {
    return jsonResponse({ error: "Gateway PIX não configurado" }, 500);
  }

  try {
    const url = new URL(req.url);

    // GET = check status
    if (req.method === "GET") {
      const transactionId = url.searchParams.get("transactionId");
      if (!transactionId) return jsonResponse({ error: "transactionId required" }, 400);

      const res = await fetch(`${KIRVUS_BASE}/gateway/transactions?id=${encodeURIComponent(transactionId)}`, {
        headers: authHeaders(),
        signal: AbortSignal.timeout(20000),
      });
      const data = await safeJson(res);
      return jsonResponse({ status: normalizeStatus(data?.status), raw: data });
    }

    // POST = create PIX
    if (req.method === "POST") {
      const body = await req.json();
      const { amount, customer, item, utm } = body;

      if (!amount || !customer?.name || !customer?.document || !customer?.email || !customer?.phone) {
        return jsonResponse({ error: "Dados obrigatórios incompletos" }, 400);
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const callbackUrl = `${supabaseUrl}/functions/v1/paradise-webhook`;

      // Kirvuspay: amount em REAIS (não centavos)
      const amountReais = Number((amount / 100).toFixed(2));
      const identifier = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      const productName = item?.title || "Produto";

      const payload = {
        identifier,
        amount: amountReais,
        client: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          document: customer.document.replace(/\D/g, ""),
        },
        // Kirvuspay valida IDs de produtos contra o catálogo do painel.
        // Para o checkout direto enviamos só metadata; a Utmify (conectada
        // nativamente no painel Kirvus) registra a venda pelo identifier.
        metadata: { utm: String(utm || "direct"), product: productName },
        callbackUrl,
      };

      console.log("Creating Kirvuspay PIX", JSON.stringify({ identifier, amount: amountReais }));

      const res = await fetch(`${KIRVUS_BASE}/gateway/pix/receive`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(45000),
      });
      const data = await safeJson(res);

      if (!res.ok) {
        console.error(`Kirvuspay ${res.status} error:`, JSON.stringify(data));
        const gatewayError = data?.message || data?.error || "Erro no gateway PIX";
        const blockedByGateway = res.status === 403 && String(gatewayError).includes("Acesso bloqueado");
        return jsonResponse({
          error: blockedByGateway
            ? "Kirvuspay bloqueou a origem da requisição. O gateway exige chamadas vindas de um servidor permitido."
            : gatewayError,
          errorCode: data?.errorCode || (blockedByGateway ? "KIRVUSPAY_ORIGIN_BLOCKED" : undefined),
        }, res.status);
      }

      console.log("Kirvuspay PIX created", JSON.stringify({ transactionId: data?.transactionId, status: data?.status }));

      const pix = data?.pix || {};
      const pixCode = pix?.code || "";
      const qrCodeBase64 = pix?.base64 || pix?.image || "";
      const transactionId = data?.transactionId || "";

      if (!pixCode || !transactionId) {
        console.error("Invalid Kirvuspay response shape:", JSON.stringify(data));
        return jsonResponse({ error: "Resposta inválida do gateway PIX", raw: data }, 502);
      }

      return jsonResponse({ pixCode, qrCodeBase64, transactionId, status: "PENDING" });
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (e) {
    console.error("pix-payment error:", e);
    const isTimeout = e instanceof DOMException && e.name === "TimeoutError";
    return jsonResponse(
      { error: isTimeout ? "Gateway PIX demorou para responder. Tente novamente em alguns segundos." : "Erro interno ao gerar PIX" },
      isTimeout ? 504 : 500,
    );
  }
});
