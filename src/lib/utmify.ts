// Utmify order tracking via Edge Function
import { supabase } from "@/integrations/supabase/client";

export type UtmifyStatus = "waiting_payment" | "paid" | "refused" | "refunded" | "chargedback";

export interface UtmifyOrderInput {
  orderId: string;
  status: UtmifyStatus;
  amountCents: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
    document: string;
  };
  product: {
    id?: string;
    name: string;
    quantity?: number;
  };
  createdAt?: string;
  approvedAt?: string;
}

function getUtmFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    src: params.get("src"),
    sck: params.get("sck"),
    utm_source: params.get("utm_source"),
    utm_campaign: params.get("utm_campaign"),
    utm_medium: params.get("utm_medium"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };
}

export async function sendUtmifyOrder(input: UtmifyOrderInput) {
  try {
    await supabase.functions.invoke("utmify-order", {
      method: "POST",
      body: { ...input, utm: getUtmFromUrl() },
    });
  } catch (e) {
    console.error("Utmify send error:", e);
  }
}
