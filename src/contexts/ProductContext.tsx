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
    id: "roxo",
    name: "LS2 CLASSIC ROXO",
    thumbnail: "/images/capacete-roxo.jpeg",
    galleryImages: ["/images/capacete-roxo.jpeg"],
  },
  {
    id: "verde",
    name: "LS2 CLASSIC VERDE",
    thumbnail: "/images/capacete-verde.jpeg",
    galleryImages: ["/images/capacete-verde.jpeg"],
  },
  {
    id: "rosa",
    name: "LS2 CLASSIC ROSA",
    thumbnail: "/images/capacete-rosa.jpeg",
    galleryImages: ["/images/capacete-rosa.jpeg"],
  },
  {
    id: "verde-neon",
    name: "LS2 CLASSIC VERDE NEON",
    thumbnail: "/images/capacete-verde-neon.jpeg",
    galleryImages: ["/images/capacete-verde-neon.jpeg"],
  },
  {
    id: "azul-rosa",
    name: "LS2 CLASSIC AZUL/ROSA",
    thumbnail: "/images/capacete-azul-rosa.jpeg",
    galleryImages: ["/images/capacete-azul-rosa.jpeg"],
  },
  {
    id: "vermelho",
    name: "LS2 CLASSIC VERMELHO",
    thumbnail: "/images/capacete-vermelho.jpeg",
    galleryImages: ["/images/capacete-vermelho.jpeg"],
  },
  {
    id: "preto-fosco",
    name: "LS2 CLASSIC PRETO FOSCO",
    thumbnail: "/images/capacete-preto-fosco.jpeg",
    galleryImages: ["/images/capacete-preto-fosco.jpeg"],
  },
  {
    id: "cinza",
    name: "LS2 CLASSIC CINZA",
    thumbnail: "/images/capacete-cinza.jpeg",
    galleryImages: ["/images/capacete-cinza.jpeg"],
  },
  {
    id: "norisk-south-africa",
    name: "NORISK Soul II Grand Prix South Africa",
    thumbnail: "/images/capacete-norisk-south-africa.png",
    galleryImages: ["/images/capacete-norisk-south-africa.png"],
    price: 57.90,
    originalPrice: 899.0,
  },
  {
    id: "norisk-argentina",
    name: "NORISK Soul II Grand Prix Argentina",
    thumbnail: "/images/capacete-norisk-argentina.png",
    galleryImages: ["/images/capacete-norisk-argentina.png"],
    price: 57.90,
    originalPrice: 899.0,
  },
  {
    id: "norisk-france",
    name: "NORISK Soul II Grand Prix France",
    thumbnail: "/images/capacete-norisk-france.png",
    galleryImages: ["/images/capacete-norisk-france.png"],
    price: 57.90,
    originalPrice: 899.0,
  },
  {
    id: "norisk-japan",
    name: "NORISK Soul II Grand Prix Japan",
    thumbnail: "/images/capacete-norisk-japan.png",
    galleryImages: ["/images/capacete-norisk-japan.png"],
    price: 57.90,
    originalPrice: 899.0,
  },
  {
    id: "norisk-brazil",
    name: "NORISK Soul II Grand Prix Brazil",
    thumbnail: "/images/capacete-norisk-brazil.png",
    galleryImages: ["/images/capacete-norisk-brazil.png"],
    price: 57.90,
    originalPrice: 899.0,
  },
  {
    id: "norisk-uk",
    name: "NORISK Soul II Grand Prix United Kingdom",
    thumbnail: "/images/capacete-norisk-uk.png",
    galleryImages: ["/images/capacete-norisk-uk.png"],
    price: 57.90,
    originalPrice: 899.0,
  },
  {
    id: "norisk-manty-rosa",
    name: "NORISK Soul II Manty Rosa Fosco",
    thumbnail: "/images/capacete-norisk-manty-rosa.png",
    galleryImages: ["/images/capacete-norisk-manty-rosa.png"],
    price: 57.90,
    originalPrice: 899.0,
  },
  {
    id: "ls2-xdron-cyan",
    name: "LS2 FF358 XDron Cyan",
    thumbnail: "/images/capacete-ls2-xdron-cyan.png",
    galleryImages: ["/images/capacete-ls2-xdron-cyan.png"],
    price: 48.97,
    originalPrice: 799.0,
  },
  {
    id: "ls2-draze-preto",
    name: "LS2 FF358 Classic Draze Preto",
    thumbnail: "/images/capacete-ls2-draze-preto.png",
    galleryImages: ["/images/capacete-ls2-draze-preto.png"],
    price: 48.97,
    originalPrice: 799.0,
  },
  {
    id: "ls2-xdron-neon",
    name: "LS2 FF358 Classic XDron Neon",
    thumbnail: "/images/capacete-ls2-xdron-neon.png",
    galleryImages: ["/images/capacete-ls2-xdron-neon.png"],
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
