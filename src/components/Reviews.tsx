import { useState } from "react";
import { Star, ChevronRight } from "lucide-react";
import avatarR from "@/assets/reviews/avatar-r.jpg";
import avatarA from "@/assets/reviews/avatar-a.jpg";
import avatarRl from "@/assets/reviews/avatar-rl.jpg";
import avatarJoel from "@/assets/reviews/avatar-joel.jpg";
import review1 from "@/assets/review-1.jpg.asset.json";
import review2 from "@/assets/review-2.jpg.asset.json";
import review3 from "@/assets/review-3.jpg.asset.json";
import review4 from "@/assets/review-4.jpg.asset.json";
import review5 from "@/assets/review-5.jpg.asset.json";
import review6 from "@/assets/review-6.jpg.asset.json";
import review7 from "@/assets/review-7.jpg.asset.json";

const reviews = [
  {
    name: "R**s",
    avatar: avatarR,
    item: "Airfryer Ninja AF500EU · Preto",
    text: "Cabe um frango inteiro, muito prático. Pode ir sem medo",
    images: [] as string[],
  },
  {
    name: "B**a",
    avatar: null,
    initial: "B",
    item: "Airfryer Ninja AF500EU · Preto",
    text: "As duas gavetas salvam o jantar, faço carne e batata juntos",
    images: [] as string[],
  },
  {
    name: "A**a",
    avatar: avatarA,
    item: "Airfryer Ninja AF500EU · Preto",
    text: "Perfeito, amei muitooo💖💖💖.",
    images: [] as string[],
  },
  {
    name: "R**l",
    avatar: avatarRl,
    item: "Airfryer Ninja AF500EU · Preto",
    text: "Peguei uma pra mim e outra pra minha mãe, ela adorou",
    images: [] as string[],
  },
  {
    name: "Joel Lima",
    avatar: avatarJoel,
    item: "Airfryer Ninja AF500EU · Preto",
    text: "Comprei meio na dúvida, mas a qualidade surpreendeu",
    images: [] as string[],
  },
];

const Reviews = () => {
  const [zoom, setZoom] = useState<string | null>(null);
  return (
    <div className="px-4 py-4 bg-background border-t-4 border-secondary">
      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4"
          onClick={() => setZoom(null)}
        >
          <img src={zoom} alt="Foto ampliada" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">Avaliações dos clientes (847)</h2>
        <button className="flex items-center text-xs text-muted-foreground">
          Ver mais <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Average */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl font-bold">4.7</span>
        <span className="text-muted-foreground text-sm">/5</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${
                s <= 4
                  ? "fill-[hsl(var(--star))] text-[hsl(var(--star))]"
                  : "fill-[hsl(var(--star))]/70 text-[hsl(var(--star))]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-5">
        {reviews.map((r, i) => (
          <div key={i} className="border-b border-border pb-4 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              {r.avatar ? (
                <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm flex items-center justify-center">
                  {r.initial}
                </div>
              )}
              <span className="text-sm font-semibold">{r.name}</span>
            </div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-[hsl(var(--star))] text-[hsl(var(--star))]" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mb-1">Item: {r.item}</p>
            <p className="text-sm text-foreground mb-2">{r.text}</p>
            {r.images.length > 0 && (
              <div className="flex gap-2 max-w-full overflow-x-auto">
                {r.images.map((img, j) => (
                  <button key={j} type="button" onClick={() => setZoom(img)} className="shrink-0">
                    <img
                      src={img}
                      alt={`Foto da avaliação de ${r.name}`}
                      loading="lazy"
                      className="h-24 w-auto max-w-[45vw] rounded-lg object-contain bg-muted"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
