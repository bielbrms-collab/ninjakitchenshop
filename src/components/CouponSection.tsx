import { ChevronRight } from "lucide-react";

const CouponSection = () => {
  return (
    <div className="px-4 py-3 bg-background border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">Ofertas</h3>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mr-4">
        <div className="min-w-[260px] flex items-center justify-between p-3 bg-[hsl(180,30%,96%)] border border-[hsl(180,40%,85%)] rounded-xl shrink-0">
          <div>
            <p className="text-sm font-bold text-foreground">Cupom de envio</p>
            <p className="text-xs text-muted-foreground">Desconto de R$ 20 no frete<br/>em pedidos acima de R$ 9</p>
          </div>
          <button className="text-sm font-bold text-[hsl(180,50%,40%)] border border-[hsl(180,50%,40%)] px-4 py-1.5 rounded-full">
            Usar
          </button>
        </div>
        <div className="min-w-[260px] flex items-center justify-between p-3 bg-[hsl(180,30%,96%)] border border-[hsl(180,40%,85%)] rounded-xl shrink-0">
          <div>
            <p className="text-sm font-bold text-foreground">Cupom da loja</p>
            <p className="text-xs text-muted-foreground">Desconto de 5%<br/>acima de R$ 99</p>
          </div>
          <button className="text-sm font-bold text-[hsl(180,50%,40%)] border border-[hsl(180,50%,40%)] px-4 py-1.5 rounded-full">
            Usar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponSection;
