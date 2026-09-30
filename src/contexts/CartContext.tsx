import { createContext, useContext, useState, ReactNode } from "react";

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
    id: "viseira",
    name: "Pague em 5 minutos e GANHE: Viseira Classic Colorida",
    image: "/images/viseira-colorida.png",
    originalPrice: 159.90,
    promoPrice: 0,
    discount: "-100%",
    selected: false,
  },
  {
    id: "intercom",
    name: "Você ganhou um DESCONTO único AGORA: Intercomunicador V6 PLUS com Bluetooth",
    image: "/images/intercomunicador-v6.png",
    originalPrice: 225.99,
    promoPrice: 19.97,
    discount: "-91%",
    selected: false,
  },
  {
    id: "intercom-v10",
    name: "OFERTA EXCLUSIVA: Fone De Ouvido Intercomunicador Moto V10 RGB",
    image: "/images/intercomunicador-v10.png",
    originalPrice: 249.90,
    promoPrice: 18.90,
    discount: "-92%",
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
