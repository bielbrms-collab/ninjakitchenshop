import { useState, useRef } from "react";
import { useProduct } from "@/contexts/ProductContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/navigation";

import ninja1 from "@/assets/ninja-site-1.jpg.asset.json";
import ninja2 from "@/assets/ninja-site-2.jpg.asset.json";
import ninja3 from "@/assets/ninja-site-3.jpg.asset.json";
import ninja4 from "@/assets/ninja-site-4.jpg.asset.json";
import ninja5 from "@/assets/ninja-site-5.jpg.asset.json";
import ninja6 from "@/assets/ninja-site-6.jpg.asset.json";
import ninja7 from "@/assets/ninja-site-7.jpg.asset.json";

const galleryImages = [
  { src: ninja1.url, label: "Ninja FlexDrawer AF500EU" },
  { src: ninja2.url, label: "Cajón flexible de 10,4 L" },
  { src: ninja3.url, label: "Tecnología Dual Zone" },
  { src: ninja4.url, label: "7 funciones de cocinado" },
  { src: ninja5.url, label: "Cocina 2 alimentos a la vez" },
  { src: ninja6.url, label: "En tu cocina" },
  { src: ninja7.url, label: "Fácil de limpiar" },
];

const ImageGallery = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [, setCurrent] = useState(0);
  const { selectedModel, selectedModelIndex } = useProduct();
  const images =
    selectedModelIndex === 0
      ? galleryImages
      : selectedModel.galleryImages.map((src) => ({
          src,
          label: `Ninja FlexDrawer ${selectedModel.colorName ?? ""}`.trim(),
        }));

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrent(swiper.activeIndex);
  };

  return (
    <div className="relative w-full bg-background overflow-hidden">
      <div className="relative aspect-square w-full image-gallery-swiper">
        <Swiper
          key={selectedModel.id}
          modules={[Pagination, Navigation]}
          slidesPerView={1}
          spaceBetween={0}
          pagination={{ clickable: true }}
          navigation
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSlideChange={handleSlideChange}
          className="h-full w-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="flex items-center justify-center">
              <div className="h-full w-full flex items-center justify-center relative">
                <img
                  src={img.src}
                  alt={img.label}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
                <span className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-foreground/70 text-background text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {img.label}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ImageGallery;
