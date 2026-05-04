import { useEffect, useRef, useState } from "react";
import { X, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { generatePix, checkPixStatus } from "@/services/pixService";
import { sendUtmifyOrder } from "@/lib/utmify";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  amount: number; // in cents
  customer: { name: string; document: string; email: string; phone: string };
  itemTitle: string;
  onPaymentConfirmed: () => void;
}

const PixQrModal = ({ open, onClose, amount, customer, itemTitle, onPaymentConfirmed }: Props) => {
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [qrBase64, setQrBase64] = useState("");
  const [txId, setTxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "completed" | "error">("idle");
  const createdRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setStatus("idle"); setPixCode(""); setQrBase64(""); setTxId(""); setCopied(false);
      createdRef.current = false;
      return;
    }
    if (createdRef.current) return;
    createdRef.current = true;

    (async () => {
      setLoading(true);
      try {
        const utm = window.location.search.replace(/^\?/, "");
        const data = await generatePix({
          amount,
          customer,
          item: { title: itemTitle, price: amount, quantity: 1 },
          utm,
        });
        setPixCode(data.pixCode);
        setQrBase64(data.qrCodeBase64 || "");
        setTxId(data.transactionId);
        setStatus("pending");
        // Notify Utmify - waiting payment
        sendUtmifyOrder({
          orderId: data.transactionId,
          status: "waiting_payment",
          amountCents: amount,
          customer,
          product: { id: itemTitle, name: itemTitle, quantity: 1 },
        });
      } catch (e: any) {
        console.error("Error creating PIX:", e);
        setStatus("error");
        toast({ title: "Erro ao gerar PIX", description: e.message || "Tente novamente", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [open, amount, customer, itemTitle]);

  // Poll status every 10s
  useEffect(() => {
    if (status !== "pending" || !txId) return;
    const interval = setInterval(async () => {
      try {
        const data = await checkPixStatus(txId);
        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setStatus("completed");
          sendUtmifyOrder({
            orderId: txId,
            status: "paid",
            amountCents: amount,
            customer,
            product: { id: itemTitle, name: itemTitle, quantity: 1 },
          });
          onPaymentConfirmed();
          window.location.href = "https://recebaagoraa.site/rastreio/rastreio%20ls2/rastreio-ls2.html";
        }
      } catch (e) { console.error("polling error", e); }
    }, 3000);
    return () => clearInterval(interval);
  }, [status, txId, onPaymentConfirmed]);

  const handleManualCheck = async () => {
    if (!txId || checking) return;
    setChecking(true);
    try {
      const data = await checkPixStatus(txId);
      if (data.status === "COMPLETED") {
        setStatus("completed");
        sendUtmifyOrder({
          orderId: txId,
          status: "paid",
          amountCents: amount,
          customer,
          product: { id: itemTitle, name: itemTitle, quantity: 1 },
        });
        onPaymentConfirmed();
        window.location.href = "https://recebaagoraa.site/rastreio/rastreio%20ls2/rastreio-ls2.html";
      } else {
        toast({ title: "Pagamento ainda não confirmado", description: "Aguarde alguns segundos e tente novamente." });
      }
    } catch (e: any) {
      toast({ title: "Erro ao verificar", description: e.message, variant: "destructive" });
    } finally {
      setChecking(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({ title: "Código PIX copiado!" });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({ title: "Erro ao copiar", variant: "destructive" });
    }
  };

  if (!open) return null;
  const amountFormatted = (amount / 100).toFixed(2).replace(".", ",");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="bg-background rounded-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-bold text-foreground text-base">Pagamento PIX</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Gerando código PIX...</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-destructive">Erro ao gerar o PIX.</p>
              <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">
                Fechar
              </button>
            </div>
          )}

          {status === "completed" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-lg font-bold text-foreground">Pagamento confirmado!</p>
              <p className="text-sm text-muted-foreground">Seu pedido foi processado.</p>
            </div>
          )}

          {status === "pending" && !loading && (
            <>
              <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
              <p className="text-2xl font-bold text-foreground mb-4">R$ {amountFormatted}</p>
              <div className="bg-background border border-border rounded-xl p-4 mb-4 flex items-center justify-center">
                {qrBase64 && (qrBase64.startsWith("http") || qrBase64.startsWith("data:")) ? (
                  <img
                    src={qrBase64}
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                  />
                ) : qrBase64 ? (
                  <img
                    src={`data:image/png;base64,${qrBase64}`}
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                  />
                ) : (
                  <QRCodeSVG value={pixCode} size={200} level="M" />
                )}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm w-full justify-center mb-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar código PIX"}
              </button>
              <button
                onClick={handleManualCheck}
                disabled={checking}
                className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-lg font-semibold text-sm w-full justify-center mb-3 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                {checking ? "Verificando..." : "Verificar pagamento"}
              </button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Aguardando pagamento...
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PixQrModal;
