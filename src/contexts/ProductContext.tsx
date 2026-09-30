import ninjaMain from "@/assets/ninja-image.png.asset.json";
import ninjaWh from "@/assets/ninja-wh.jpg.asset.json";
import ninjaCyd from "@/assets/ninja-cyd.jpg.asset.json";
import ninjaSd from "@/assets/ninja-sd.jpg.asset.json";
import ninjaCp from "@/assets/ninja-cp.jpg.asset.json";
import { createContext, useContext, useState, ReactNode } from "react";

export interface ProductModel {
  id: string;
  name: string;
  colorName?: string;
  thumbnail: string;
  galleryImages: string[];
  price?: number;
  originalPrice?: number;
}

const productModels: ProductModel[] = [
  {
    id: "ninja-af500eu-negro",
    name: "Ninja FlexDrawer AF500EU 10,4 L Negro",
    thumbnail: ninjaMain.url,
    galleryImages: [ninjaMain.url],
    price: 48.97,
    originalPrice: 799.0,
    colorName: "Preto",
  },
  {
    id: "ninja-af500eu-branco",
    name: "Ninja FlexDrawer AF500EU 10,4 L Branco",
    colorName: "Branco",
    thumbnail: ninjaWh.url,
    galleryImages: [ninjaWh.url],
    price: 48.97,
    originalPrice: 799.0,
  },
  {
    id: "ninja-af500eu-azul",
    name: "Ninja FlexDrawer AF500EU 10,4 L Azul Ciberespaço",
    colorName: "Azul Ciberespaço",
    thumbnail: ninjaCyd.url,
    galleryImages: [ninjaCyd.url],
    price: 58.97,
    originalPrice: 799.0,
  },
  {
    id: "ninja-af500eu-preto-cobre",
    name: "Ninja FlexDrawer AF500EU 10,4 L Preto/Cobre",
    colorName: "Preto/Cobre",
    thumbnail: ninjaCp.url,
    galleryImages: [ninjaCp.url],
    price: 61.8,
    originalPrice: 799.0,
  },
  {
    id: "ninja-af500eu-bege-dourado",
    name: "Ninja FlexDrawer AF500EU 10,4 L Bege/Dourado",
    colorName: "Bege/Dourado",
    thumbnail: ninjaSd.url,
    galleryImages: [ninjaSd.url],
    price: 75.9,
    originalPrice: 799.0,
  },
];

interface ProductContextType {
  models: ProductModel[];
  selectedModelIndex: number;
  setSelectedModelIndex: (i: number) => void;
  selectedModel: ProductModel;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);

  return (
    <ProductContext.Provider
      value={{
        models: productModels,
        selectedModelIndex,
        setSelectedModelIndex,
        selectedModel: productModels[selectedModelIndex],
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be inside ProductProvider");
  return ctx;
};
