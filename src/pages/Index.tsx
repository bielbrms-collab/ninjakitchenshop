import { useEffect } from "react";
import ProductHeader from "@/components/ProductHeader";
import ImageGallery from "@/components/ImageGallery";
import FlashSale from "@/components/FlashSale";
import ProductInfo from "@/components/ProductInfo";
import CustomerProtection from "@/components/CustomerProtection";
import Reviews from "@/components/Reviews";
import StoreInfo from "@/components/StoreInfo";
import ProductDescription from "@/components/ProductDescription";
import StickyFooter from "@/components/StickyFooter";
import SocialProofToast from "@/components/SocialProofToast";
import { initTikTokPixel, tiktokPageView } from "@/lib/tiktokTracking";

const Index = () => {
  useEffect(() => {
    initTikTokPixel();
    tiktokPageView();
  }, []);

  return (
    <div className="min-h-screen bg-secondary max-w-lg mx-auto relative">
      <ProductHeader />
      <ImageGallery />
      <FlashSale />
      <ProductInfo />
      <CustomerProtection />
      <Reviews />
      <StoreInfo />
      <ProductDescription />
      <div className="h-20" />
      <StickyFooter />
      <SocialProofToast />
    </div>
  );
};

export default Index;
