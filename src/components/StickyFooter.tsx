import { useState } from "react";
import { Home, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/contexts/ProductContext";
import ProductSelectModal from "./ProductSelectModal";

const StickyFooter = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"cart" | "buy">("buy");
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { selectedModel } = useProduct();

  const handleOpenModal = (mode: "cart" | "buy") => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex items-center max-w-lg mx-auto">
          <button className="flex flex-col items-center justify-center px-3 py-2">
            <Home className="w-5 h-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Tienda</span>
          </button>
          <button className="flex flex-col items-center justify-center px-3 py-2">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Chat</span>
          </button>
          <div className="flex flex-1 gap-2 p-2">
            <button
              onClick={() => handleOpenModal("cart")}
              className="flex-1 py-3 rounded-full bg-secondary text-foreground font-semibold text-sm border border-border"
            >
              Añadir al carrito
            </button>
            <button
              onClick={() => handleOpenModal("buy")}
              className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
      <ProductSelectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
      />
    </>
  );
};

export default StickyFooter;
