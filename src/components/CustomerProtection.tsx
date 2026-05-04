import { ShieldCheck, Check, ChevronRight } from "lucide-react";

const items = [
  "Devolução gratuita",
  "Reembolso automático por danos",
  "Pagamento seguro",
  "Cupom por atraso na coleta",
];

const CustomerProtection = () => {
  return (
    <div className="px-4 py-3 bg-background border-t-4 border-secondary">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[hsl(145,60%,40%)]" />
          <h3 className="text-sm font-bold text-[hsl(145,60%,35%)]">Proteção do cliente</h3>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerProtection;
