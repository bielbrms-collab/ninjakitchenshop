import ninjaMain from "@/assets/ninja-image.png.asset.json";
import { createContext, useContext, useState, ReactNode } from "react";

export interface ProductModel {
  id: string;
  name: string;
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
