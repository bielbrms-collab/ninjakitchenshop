import { X, Share2, ShoppingCart, MoreVertical } from "lucide-react";

const ProductHeader = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <button className="p-1">
        <X className="w-5 h-5 text-foreground" />
      </button>
      <div className="flex items-center gap-4">
        <button className="p-1">
          <Share2 className="w-5 h-5 text-foreground" />
        </button>
        <button className="p-1">
          <MoreVertical className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
};

export default ProductHeader;
