import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/contexts/ProductContext";
import { tiktokInitiateCheckout } from "@/lib/tiktokTracking";


const sizes = ["10,4 L"];

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "cart" | "buy";
}

const ProductSelectModal = ({ open, onClose, mode }: Props) => {
  const { models, selectedModelIndex, setSelectedModelIndex, selectedModel } = useProduct();
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  const price = selectedModel.price ?? 48.97;
  const originalPrice = selectedModel.originalPrice ?? 799.0;

  const handleAction = () => {
    addItem({
      model: selectedModel.name,
      modelImage: selectedModel.thumbnail,
      size: sizes[selectedSize],
      quantity,
      price,
      originalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-lg border border-border overflow-hidden shrink-0">
              <img src={selectedModel.thumbnail} alt={selectedModel.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-primary">R$ {price.toFixed(2).replace(".", ",")}</p>
              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded mt-1 inline-block">
                Economize 4% com bônus
              </span>
            </div>
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Model selector */}
        <div className="px-4 py-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Cor ({models.length})</h3>
          <div className="grid grid-cols-3 gap-3">
            {models.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelectedModelIndex(i)}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  i === selectedModelIndex ? "border-primary" : "border-border"
                }`}
              >
                <div className="aspect-square bg-secondary">
                  <img src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] text-foreground font-medium px-1 py-1.5 truncate text-center">{m.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Size selector */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Capacidade ({sizes.length})</h3>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s, i) => (
              <button
                key={s}
                onClick={() => setSelectedSize(i)}
                className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  i === selectedSize ? "border-primary text-primary bg-primary/5" : "border-border text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="px-4 pb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Quantidade</h3>
          <div className="flex items-center border border-border rounded-lg w-fit">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-5 text-sm font-semibold text-foreground min-w-[40px] text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-muted-foreground">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-3">
          {mode === "cart" && (
            <button onClick={handleAction} className="flex-1 py-3.5 rounded-full bg-secondary text-foreground font-semibold text-sm">
              Adicionar ao carrinho
            </button>
          )}
          <button
            onClick={() => {
              handleAction();
              tiktokInitiateCheckout(price * quantity, selectedModel.id, `AIRFRYER ${selectedModel.name}`);
              navigate("/checkout");
            }}
            className="flex-1 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
          >
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectModal;
