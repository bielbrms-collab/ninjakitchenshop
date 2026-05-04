import { supabase } from "@/integrations/supabase/client";

export interface PixCustomer {
  name: string;
  document: string;
  email: string;
  phone: string;
}

export interface PixItem {
  title: string;
  price: number; // cents
  quantity: number;
}

export interface GeneratePixParams {
  amount: number; // cents
  customer: PixCustomer;
  item: PixItem;
  utm?: string;
}

export interface PixResponse {
  pixCode: string;        // Copia e Cola
  transactionId: string;
  status: string;
  qrCodeBase64?: string;  // optional, if API returns image
}

export interface PixStatusResponse {
  status: "PENDING" | "COMPLETED" | "FAILED";
  raw?: unknown;
}

/**
 * Generates a PIX charge via the SlimmPay gateway (proxied by edge function).
 */
export async function generatePix(params: GeneratePixParams): Promise<PixResponse> {
  const { data, error } = await supabase.functions.invoke("pix-payment", {
    method: "POST",
    body: params,
  });
  if (error) throw new Error(data?.error || "Falha ao gerar PIX");
  if (data?.error) {
    const msg = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
    throw new Error(msg);
  }
  return data as PixResponse;
}

/**
 * Checks the current status of a PIX transaction.
 */
export async function checkPixStatus(transactionId: string): Promise<PixStatusResponse> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pix-payment?transactionId=${encodeURIComponent(transactionId)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
  return (await res.json()) as PixStatusResponse;
}
