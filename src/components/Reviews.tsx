import { Star, ChevronRight } from "lucide-react";
import avatarR from "@/assets/reviews/avatar-r.jpg";
import avatarA from "@/assets/reviews/avatar-a.jpg";
import avatarRl from "@/assets/reviews/avatar-rl.jpg";
import r1 from "@/assets/reviews/r-1.jpg";
import r2 from "@/assets/reviews/r-2.jpg";
import b1 from "@/assets/reviews/b-1.jpg";
import b2 from "@/assets/reviews/b-2.jpg";
import a1 from "@/assets/reviews/a-1.jpg";
import a2 from "@/assets/reviews/a-2.jpg";
import a3 from "@/assets/reviews/a-3.jpg";
import a4 from "@/assets/reviews/a-4.jpg";
import rl1 from "@/assets/reviews/rl-1.jpg";
import rl2 from "@/assets/reviews/rl-2.jpg";
import avatarJoel from "@/assets/reviews/avatar-joel.jpg";
import joel1 from "@/assets/reviews/joel-1.jpg";

const reviews = [
  {
    name: "R**s",
    avatar: avatarR,
    item: "Capacete LS2",
    text: "Bagulho é bom mesmo fml pode ir sem medo",
    images: [r1, r2],
  },
  {
    name: "B**a",
    avatar: null,
    initial: "B",
    item: "Capacete LS2",
    text: "LS2 é a melhor não tem jeito amei muito",
    images: [b1, b2],
  },
  {
    name: "A**a",
    avatar: avatarA,
    item: "Capacete LS2",
    text: "Perfeito, amei muitooo💖💖💖.",
    images: [a1, a2, a3, a4],
  },
  {
    name: "R**l",
    avatar: avatarRl,
    item: "Capacete LS2",
    text: "Peguei um pra mim e um pra minha mulher ela adorou",
    images: [rl1, rl2],
  },
  {
    name: "Joel Lima",
    avatar: avatarJoel,
    item: "Capacete NORISK",
    text: "Comprei meio na dúvida, mas a qualidade surpreendeu",
    images: [joel1],
  },
];

const Reviews = () => {
  return (
    <div className="px-4 py-4 bg-background border-t-4 border-secondary">
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
            <div className="flex gap-2 overflow-x-auto">
              {r.images.map((img, j) => (
                <img
                  key={j}
                  src={img}
                  alt="Review"
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
