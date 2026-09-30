const features = [
  "Capacidade total de 10,4 L – MegaZone para refeições familiares ou peças grandes, como um frango inteiro",
  "Divida em duas zonas independentes de 5,2 L com o divisor removível",
  "Tecnologia Dual Zone: cozinhe dois alimentos diferentes, cada um com tempo e temperatura próprios",
  "Função SYNC: os dois preparos terminam ao mesmo tempo",
  "7 funções: Air Fry, Max Crisp, Roast, Bake, Prove, Dehydrate e Reheat",
  "Potência de 2470 W",
  "Acessórios aptos para lava-louças",
  "Cor: preta",
  "Modelo: AF500EU",
];

const specs = [
  ["Capacidade", "10,4 L (ou 2 × 5,2 L)"],
  ["Potência", "2470 W"],
  ["Funções", "7"],
  ["Peso aprox.", "11,3 kg"],
  ["Dimensões aprox.", "56,79 × 38,81 × 41,91 cm"],
  ["Cor", "Preto"],
  ["Modelo", "AF500EU"],
];

const boxItems = [
  "Unidade principal",
  "1 gaveta/cesto",
  "1 divisor",
  "2 grelhas antiaderentes",
  "Manual de instruções",
  "Livro de receitas",
];

const ProductDescription = () => {
  return (
    <div className="px-4 py-4 bg-background border-t-4 border-secondary">
      <h2 className="text-base font-bold text-foreground mb-3">Descrição</h2>
      <p className="text-sm text-foreground leading-relaxed mb-4">
        A Airfryer Ninja FlexDrawer AF500EU é a fritadeira sem óleo dupla ou XL: use a MegaZone de 10,4 L
        para preparar grandes quantidades de uma só vez ou coloque o divisor e crie duas zonas de 5,2 L para
        cozinhar pratos diferentes ao mesmo tempo. Com a função SYNC, tudo fica pronto junto — mais sabor,
        menos óleo e menos tempo na cozinha.
      </p>
      <h3 className="text-sm font-bold text-foreground mb-2">CARACTERÍSTICAS:</h3>
      <ul className="space-y-1.5 text-sm text-foreground mb-4">
        {features.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary shrink-0">•</span>
            {item}
          </li>
        ))}
      </ul>
      <h3 className="text-sm font-bold text-foreground mb-2">ESPECIFICAÇÕES TÉCNICAS:</h3>
      <div className="text-sm text-foreground mb-4 divide-y divide-border border border-border rounded-lg">
        {specs.map(([k, v]) => (
          <div key={k} className="flex justify-between px-3 py-2 gap-3">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium text-right">{v}</span>
          </div>
        ))}
      </div>
      <h3 className="text-sm font-bold text-foreground mb-2">CONTEÚDO DA CAIXA:</h3>
      <ul className="space-y-1.5 text-sm text-foreground">
        {boxItems.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary shrink-0">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDescription;
