import { createContext, useContext, useState, ReactNode } from "react";
import bump1 from "@/assets/bump-15.png.asset.json";
import bump2 from "@/assets/bump-16.png.asset.json";
import bump3 from "@/assets/bump-17.png.asset.json";

export interface CartItem {
  model: string;
  modelImage: string;
  size: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

export interface UpsellItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  originalPrice: number;
  promoPrice: number;
  discount: string;
  selected: boolean;
}

interface CartContextType {
  items: CartItem[];
  upsells: UpsellItem[];
  shippingMethod: string;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleUpsell: (id: string) => void;
  setShippingMethod: (method: string) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
}

const defaultUpsells: UpsellItem[] = [
  {
    id: "moldes-silicona",
    name: "¡AÑADE AHORA! Kit de Moldes de Silicona para Air Fryer",
    description: "Reutilizables, prácticos y fáciles de limpiar.",
    image: bump1.url,
    originalPrice: 9.97,
    promoPrice: 9.97,
    discount: "",
    selected: false,
  },
  {
    id: "kit-accesorios",
    name: "¡OFERTA ESPECIAL! Kit de Accesorios para Air Fryer",
    description: "Todo lo que necesitas para aprovechar aún más tu Air Fryer.",
    image: bump2.url,
    originalPrice: 14.97,
    promoPrice: 14.97,
    discount: "",
    selected: false,
  },
  {
    id: "protector-reutilizable",
    name: "¡COMPLETA TU PEDIDO! Protector Reutilizable para Air Fryer",
    description: "Ayuda a proteger la cesta y facilita la limpieza.",
    image: bump3.url,
    originalPrice: 7.97,
    promoPrice: 7.97,
    discount: "",
    selected: false,
  },
];

const shippingOptions: Record<string, number> = {
  standard: 6,
  express: 12,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [upsells, setUpsells] = useState<UpsellItem[]>(defaultUpsells);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const addItem = (item: CartItem) => {
    setItems([item]); // single product store
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const toggleUpsell = (id: string) => {
    setUpsells((prev) =>
      prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u))
    );
  };

  const getSubtotal = () => {
    const itemsTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const upsellTotal = upsells
      .filter((u) => u.selected)
      .reduce((s, u) => s + u.promoPrice, 0);
    return itemsTotal + upsellTotal;
  };

  const getDiscount = () => {
    const itemDiscount = items.reduce(
      (s, i) => s + (i.originalPrice - i.price) * i.quantity,
      0
    );
    const upsellDiscount = upsells
      .filter((u) => u.selected)
      .reduce((s, u) => s + (u.originalPrice - u.promoPrice), 0);
    return itemDiscount + upsellDiscount;
  };

  const getShippingCost = () => shippingOptions[shippingMethod] ?? 0;

  const getTotal = () => getSubtotal() + getShippingCost();

  const getTotalItems = () => {
    return items.reduce((s, i) => s + i.quantity, 0) + upsells.filter((u) => u.selected).length;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        upsells,
        shippingMethod,
        addItem,
        updateItemQuantity,
        clearCart,
        toggleUpsell,
        setShippingMethod,
        getSubtotal,
        getDiscount,
        getShippingCost,
        getTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
