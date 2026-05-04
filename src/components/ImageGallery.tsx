import { useState, useEffect, useRef } from "react";
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

const ImageGallery = () => {
  const { models, setSelectedModelIndex } = useProduct();
  // Show all models in the carousel so user can swipe through all products
  const images = models.map((m) => ({ src: m.thumbnail, label: m.name }));
  const swiperRef = useRef<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrent(swiper.activeIndex);
    setSelectedModelIndex(swiper.activeIndex);
  };

  return (
    <div className="relative w-full bg-background overflow-hidden">
      <div className="relative aspect-square w-full image-gallery-swiper">
        <Swiper
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
