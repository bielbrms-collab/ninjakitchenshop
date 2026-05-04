const ProductDescription = () => {
  return (
    <div className="px-4 py-4 bg-background border-t-4 border-secondary">
      <h2 className="text-base font-bold text-foreground mb-3">Descrição</h2>
      <p className="text-sm text-foreground leading-relaxed mb-4">
        O LS2 é um capacete ideal para o dia a dia, com diferentes gráficos para atender quaisquer estilos.
        Sua tecnologia tornou-se referência em cascos desenvolvidos em ABS, sendo classificado com 4 estrelas Sharp,
        pelo órgão britânico que adota os mais rigorosos padrões de segurança mundial.
        Tudo isso com ganhos de conforto, pois pesa apenas 1.400 gramas.
      </p>
      <h3 className="text-sm font-bold text-foreground mb-2">CARACTERÍSTICAS:</h3>
      <ul className="space-y-1.5 text-sm text-foreground">
        {[
          "Casco em HPTT (High Pressure Thermoplastic Technology), resina termoplástica de alta resistência (ABS)",
          "Peso médio: 1400 gramas",
          "EPS multidensidade",
          "Entrada de ar superior e frontal",
          "Acabamento com verniz brilho com proteção UV",
          "Forração cortada a laser com tratamento hipoalérgico, removível, lavável e respirável",
          "Bavete e narigueira removível",
          "Viseira flat de 2mm, resistente a riscos",
          "Sistema troca rápida de viseira",
          "Fecho com engate micrométrico",
        ].map((item, i) => (
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
