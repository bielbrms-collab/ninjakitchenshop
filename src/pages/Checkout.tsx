import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, ChevronRight, Minus, Plus, Smile, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { tiktokPageView, tiktokIdentify, tiktokCompletePayment } from "@/lib/tiktokTracking";


const Checkout = () => {
  const navigate = useNavigate();
  const {
    items,
    upsells,
    shippingMethod,
    toggleUpsell,
    setShippingMethod,
    updateItemQuantity,
    getSubtotal,
    getDiscount,
    getShippingCost,
    getTotal,
    getTotalItems,
  } = useCart();

  const [cep, setCep] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cpf, setCpf] = useState("");
  const [addressFilled, setAddressFilled] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [countdown, setCountdown] = useState(14 * 60 + 54);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    tiktokPageView();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (false && digits.length === 8) {
      setCepLoading(true);
      fetch(`https://viacep.com.br/ws/${digits}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setEndereco(data.logradouro || "");
            setBairro(data.bairro || "");
            setCidade(data.localidade || "");
            setEstado(data.uf || "");
          }
        })
        .catch(() => {})
        .finally(() => setCepLoading(false));
    }
  }, [cep]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `00:${m}:${s}`;
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const isValidCpf = (cpfValue: string): boolean => {
    const digits = cpfValue.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    if (rest !== parseInt(digits[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    return rest === parseInt(digits[10]);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const item = items[0];
  if (!item) return null;

  const shippingOptions = [
    {
      id: "standard",
      label: "Envío estándar",
      price: 6.0,
    },
    {
      id: "express",
      label: "Envío exprés",
      price: 12.0,
    },
  ];

  // Card payment provider hook: no card integration is configured in this project yet.
  const handleContinue = async () => {
    if (paymentLoading) return;
    if (!addressFilled) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast({ title: "Confirma tu dirección", description: "Completa tus datos de envío antes de pagar." });
      return;
    }
    setPaymentError("");
    setPaymentLoading(true);
    try {
      throw new Error("card-provider-not-configured");
    } catch {
      setPaymentError("No se ha podido cargar el pago con tarjeta. Inténtalo de nuevo en unos minutos.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const savings = getDiscount();
  const total = getTotal();
  const totalItems = getTotalItems();

  return (
    <div className="min-h-screen bg-secondary max-w-lg mx-auto pb-40">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate("/")} className="mr-3">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-foreground text-base">Resumen del pedido</h1>
            <p className="text-xs text-emerald-500 flex items-center justify-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 text-background text-[8px] flex items-center justify-center">✓</span>
              Pago seguro garantizado
            </p>
          </div>
          <div className="w-5" />
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-background px-4 py-3 border-b border-border">
        {!addressFilled ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm text-foreground">Dirección de envío</span>
            </div>
            <input
              type="text"
              placeholder="Nombre completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value.slice(0, 20))}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Código postal"
              value={cep}
              onChange={(e) => setCep(e.target.value.slice(0, 10))}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            {cepLoading && (
              <p className="text-xs text-muted-foreground">Buscando dirección...</p>
            )}
            <input
              type="text"
              placeholder="Calle"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Número / Piso"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-1/3 px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Barrio (opcional)"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ciudad"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Provincia"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-1/3 px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <input
              type="text"
              placeholder="DNI / NIE / Pasaporte"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.slice(0, 20))}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => {
                if (!nome || !telefone || !cep || !endereco || !numero || !cidade || !cpf) {
                  toast({ title: "Faltan datos", description: "Completa todos los campos obligatorios.", variant: "destructive" });
                  return;
                }
                setAddressFilled(true);
                // Advanced matching - send hashed phone
                tiktokIdentify(undefined, telefone);
              }}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm"
            >
              Confirmar dirección
            </button>
          </div>
        ) : (
          <button onClick={() => setAddressFilled(false)} className="flex items-center w-full">
            <MapPin className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">
                {nome}, {telefone}
              </p>
              <p className="text-xs text-muted-foreground">
                {endereco}, {numero}{bairro ? ` - ${bairro}` : ""}, {cep} {cidade}{estado ? ` (${estado})` : ""}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* CPF display */}
      {addressFilled && (
        <div className="bg-background px-4 py-2 border-b border-border flex items-center gap-2">
          <span className="text-muted-foreground text-sm">👤</span>
          <span className="text-sm text-foreground">Documento: {cpf}</span>
        </div>
      )}

      {/* Dashed separator */}
      <div className="h-2 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 opacity-40" style={{
        backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--primary)) 0, hsl(var(--primary)) 12px, transparent 12px, transparent 20px)"
      }} />

      {/* Product */}
      <div className="bg-background px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-sm text-foreground">Ninja</span>
          <button className="text-xs text-muted-foreground flex items-center gap-1">
            Añadir nota <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3">
          <img
            src={item.modelImage}
            alt={item.model}
            className="w-20 h-20 object-cover rounded-lg border border-border"
          />
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground leading-tight">
              FREIDORA DE AIRE {item.model}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{item.model}</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="text-primary font-bold text-sm">
                  € {item.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground line-through text-xs ml-1">
                  € {item.originalPrice.toFixed(2)}
                </span>
                <span className="text-primary text-xs ml-1">
                  -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                </span>
              </div>
              <div className="flex items-center border border-border rounded">
                <button onClick={() => updateItemQuantity(0, item.quantity - 1)} className="px-2 py-1 text-muted-foreground">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-foreground">{item.quantity}</span>
                <button onClick={() => updateItemQuantity(0, item.quantity + 1)} className="px-2 py-1 text-muted-foreground">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-secondary px-4 py-4">
        <h3 className="font-bold text-sm text-foreground mb-3">Método de envío</h3>
        <div className="space-y-2">
          {shippingOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setShippingMethod(opt.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg border ${
                shippingMethod === opt.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${
                shippingMethod === opt.id ? "border-primary" : "border-muted-foreground"
              }`}>
                {shippingMethod === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{opt.label}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">€ {opt.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upsells */}
      <div className="bg-background px-4 py-3 space-y-2">
        {upsells.map((upsell) => (
          <button
            key={upsell.id}
            onClick={() => toggleUpsell(upsell.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg border ${
              upsell.selected ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 mt-1 flex items-center justify-center shrink-0 ${
              upsell.selected ? "border-primary bg-primary" : "border-muted-foreground"
            }`}>
              {upsell.selected && <span className="text-background text-xs">✓</span>}
            </div>
            <img src={upsell.image} alt={upsell.name} className="w-16 h-16 object-contain rounded bg-background" />
            <div className="flex-1 text-left">
              <p className="text-xs font-medium text-foreground leading-tight">{upsell.name}</p>
              {upsell.description && (
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{upsell.description}</p>
              )}
              <div className="mt-1">
                <span className="text-primary font-bold text-sm">
                  € {upsell.promoPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-background px-4 py-4 border-t border-border">
        <h3 className="font-bold text-sm text-foreground mb-3">Resumen del pedido</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground">Subtotal del producto</span>
            <span className="text-foreground font-medium">€ {getSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary text-xs">Descuento en el producto</span>
            <span className="text-primary text-xs">- € {getDiscount().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground">Subtotal del envío</span>
            <span className="text-foreground font-medium">€ {getShippingCost().toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold text-foreground">Total</span>
            <div className="text-right">
              <span className="font-bold text-lg text-foreground">€ {total.toFixed(2)}</span>
              <p className="text-[10px] text-muted-foreground">Impuestos incluidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cashback */}
      <div className="bg-emerald-50 px-4 py-2 flex justify-between items-center">
        <span className="text-sm text-foreground font-medium">Bonificación de cashback que ganarás</span>
        <span className="text-primary font-bold text-sm">{Math.round(total * 100)} puntos</span>
      </div>

      {/* Payment Methods */}
      <div id="payment-section" className="bg-background px-4 py-4 border-t border-border">
        <h3 className="font-bold text-sm text-foreground mb-3">Método de pago</h3>
        <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-primary bg-primary/5">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-foreground" />
            <span className="text-sm font-semibold text-foreground">Tarjeta de crédito o débito</span>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
        </div>
        <button
          disabled={paymentLoading}
          onClick={handleContinue}
          className="w-full mt-3 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm disabled:opacity-60"
        >
          {paymentLoading ? "Cargando..." : "Continuar"}
        </button>
        {paymentError && <p className="text-xs text-destructive mt-2 text-center">{paymentError}</p>}
      </div>

      {/* Savings Banner */}
      <div className="bg-primary/10 px-4 py-2 flex items-center justify-center gap-2">
        <Smile className="w-4 h-4 text-primary" />
        <span className="text-primary text-xs font-medium">
          Ahorras € {savings.toFixed(2)} en este pedido.
        </span>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-w-lg mx-auto">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Total ({totalItems} {totalItems === 1 ? "artículo" : "artículos"})
            </span>
            <span className="text-primary font-bold text-lg">€ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              if (!addressFilled) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-base"
          >
            Realizar pedido
          </button>
          <p className="text-center text-xs text-primary mt-1">
            La oferta relámpago termina en {formatTime(countdown)}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
