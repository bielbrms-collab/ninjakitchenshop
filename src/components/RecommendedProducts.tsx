import { Star } from "lucide-react";

const products = [
  {
    name: "CAPACETE LS2 DRIFTER MONOCOLOR PRETO FOSCO",
    price: "R$ 67,48",
    original: "R$ 1299,90",
    discount: "-95%",
    img: "https://tknbmxnsckpgvpwwuhfr.supabase.co/storage/v1/object/public/product-images/products/1766367783875-0zgukk.png",
  },
  {
    name: "SPOILER LS2 RAPID",
    price: "R$ 17,90",
    original: "R$ 99,90",
    discount: "-82%",
    img: "https://tknbmxnsckpgvpwwuhfr.supabase.co/storage/v1/object/public/product-images/products/1766367779296-efdlri.png",
  },
  {
    name: "CAPACETE LS2 AIRFLOW II DRAZE",
    price: "R$ 39,41",
    original: "R$ 699,91",
    discount: "-94%",
    img: "https://tknbmxnsckpgvpwwuhfr.supabase.co/storage/v1/object/public/product-images/products/1766367775367-gf1lrh.png",
  },
  {
    name: "CAPACETE NORISK CITY MONOCOLOR CINZA FOSCO",
    price: "R$ 57,90",
    original: "R$ 569,90",
    discount: "-90%",
    img: "https://tknbmxnsckpgvpwwuhfr.supabase.co/storage/v1/object/public/product-images/products/1766367771182-69rfuo.png",
  },
  {
    name: "ÓCULOS INTERNO CAPACETE LS2 UNIVERSAL",
    price: "R$ 9,90",
    original: "R$ 69,90",
    discount: "-86%",
    img: "https://tknbmxnsckpgvpwwuhfr.supabase.co/storage/v1/object/public/product-images/products/1766367766554-fl7rr9.png",
  },
  {
    name: "CAPACETE LS2 CLASSIC PRO STRIKER ROSA",
    price: "R$ 42,94",
    original: "R$ 899,90",
    discount: "-95%",
    img: "https://tknbmxnsckpgvpwwuhfr.supabase.co/storage/v1/object/public/product-images/products/1766367789827-oyhp2z.png",
  },
];

const RecommendedProducts = () => {
  return (
    <div className="px-4 py-4 bg-background border-t-4 border-secondary">
      <h2 className="text-base font-bold text-foreground mb-4">Você também pode gostar</h2>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden bg-background">
            <div className="relative aspect-square bg-secondary">
              <img src={p.img} alt={p.name} className="w-full h-full object-contain" />
              <span className="absolute top-2 left-2 bg-[hsl(var(--discount-tag))] text-[hsl(var(--discount-tag-foreground))] text-[10px] font-bold px-1.5 py-0.5 rounded">
                {p.discount}
              </span>
            </div>
            <div className="p-2">
              <p className="text-xs text-foreground line-clamp-2 mb-1 font-medium">{p.name}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-[hsl(var(--price-promo))]">{p.price}</span>
                <span className="text-[10px] line-through text-[hsl(var(--price-original))]">{p.original}</span>
              </div>
              <div className="flex items-center gap-0.5 mt-1">
                <Star className="w-3 h-3 fill-[hsl(var(--star))] text-[hsl(var(--star))]" />
                <span className="text-[10px] text-muted-foreground">5.0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
