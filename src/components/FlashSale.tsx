import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { useProduct } from "@/contexts/ProductContext";

const FlashSale = () => {
  const [time, setTime] = useState({ h: 1, m: 0, s: 0 });
  const { selectedModel } = useProduct();

  const price = selectedModel.price ?? 48.97;
  const originalPrice = selectedModel.originalPrice ?? 799.0;
  const discount = Math.round((1 - price / originalPrice) * 100);
  const savings = originalPrice - price;
  const fmt = (n: number) => n.toFixed(2).replace(".", ",");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        const total = prev.h * 3600 + prev.m * 60 + prev.s - 1;
        if (total <= 0) return { h: 1, m: 0, s: 0 };
        return {
          h: Math.floor(total / 3600),
          m: Math.floor((total % 3600) / 60),
          s: total % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div>
      {/* Dark price bar */}
      <div className="bg-[hsl(250,30%,15%)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
            <span className="text-2xl font-extrabold text-primary-foreground">
              € {fmt(price)}
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Oferta relámpago
            </div>
            <span className="text-xs text-primary-foreground/80">
              Termina en{" "}
              <span className="font-mono font-bold text-primary-foreground">
                {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
              </span>
            </span>
          </div>
        </div>
        <span className="text-sm line-through text-primary-foreground/50 mt-1 block">
          € {fmt(originalPrice)}
        </span>
      </div>

      {/* Green savings bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(145,60%,95%)] border-b border-border">
        <span className="text-xs">🏷️</span>
        <span className="text-xs text-[hsl(145,60%,30%)] font-medium">
          Descuento de € {fmt(savings)}
        </span>
        <span className="text-xs text-[hsl(145,60%,30%)] font-semibold">
          Ahorra un {discount}% con bonificación
        </span>
      </div>
    </div>
  );
};

export default FlashSale;
