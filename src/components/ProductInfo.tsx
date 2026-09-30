import { useState } from "react";
import { Star, Truck, Grid3X3 } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useProduct } from "@/contexts/ProductContext";
import ProductSelectModal from "./ProductSelectModal";

const ProductInfo = () => {
  const { models, selectedModelIndex, setSelectedModelIndex, selectedModel } = useProduct();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-background">
      {/* Title */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded">
            Oficial
          </span>
          <h1 className="text-base font-bold text-foreground leading-tight">
            AIRFRYER NINJA FLEXDRAWER AF500EU 10,4 L – DUAL ZONE, 7 FUNÇÕES, PRETA
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 fill-[hsl(var(--star))] text-[hsl(var(--star))]" />
          <span className="font-semibold">4.9</span>
          <span className="text-primary">(847)</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">2448 vendidos</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-primary text-xs bg-primary/10 px-1.5 py-0.5 rounded">
            Frete grátis
          </span>
          <span className="text-muted-foreground text-xs">Receba até 13-16 de abr</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-6 line-through">
          Taxa de envio: R$ 14,50
        </p>
      </div>

      {/* Variant selector - 3 options */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 w-full"
        >
          <Grid3X3 className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2 flex-1">
            {models.slice(0, 3).map((model, i) => (
              <div
                key={model.id}
                className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 ${
                  i === selectedModelIndex ? "border-primary" : "border-border"
                }`}
              >
                <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Cor: Preto</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <ProductSelectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="buy"
      />
    </div>
  );
};

export default ProductInfo;
