const features = [
  "Capacidad total de 10,4 L – MegaZone para comidas familiares o piezas grandes, como un pollo entero",
  "Divídela en dos zonas independientes de 5,2 L con el separador extraíble",
  "Tecnología Dual Zone: cocina dos alimentos distintos, cada uno con su propio tiempo y temperatura",
  "Función SYNC: las dos preparaciones terminan a la vez",
  "7 funciones: Air Fry, Max Crisp, Roast, Bake, Prove, Dehydrate e Reheat",
  "Potencia de 2470 W",
  "Accesorios aptos para lavavajillas",
  "Color: negro",
  "Modelo: AF500EU",
];

const specs = [
  ["Capacidad", "10,4 L (o 2 × 5,2 L)"],
  ["Potencia", "2470 W"],
  ["Funciones", "7"],
  ["Peso aprox.", "11,3 kg"],
  ["Dimensiones aprox.", "56,79 × 38,81 × 41,91 cm"],
  ["Color", "Negro"],
  ["Modelo", "AF500EU"],
];

const boxItems = [
  "Unidad principal",
  "1 cajón/cesta",
  "1 separador",
  "2 rejillas antiadherentes",
  "Manual de instrucciones",
  "Libro de recetas",
];

const ProductDescription = () => {
  return (
    <div className="px-4 py-4 bg-background border-t-4 border-secondary">
      <h2 className="text-base font-bold text-foreground mb-3">Descripción</h2>
      <p className="text-sm text-foreground leading-relaxed mb-4">
        La freidora de aire Ninja FlexDrawer AF500EU es doble o XL: usa la MegaZone de 10,4 L
        para preparar grandes cantidades de una vez o coloca el separador y crea dos zonas de 5,2 L para
        cocinar platos diferentes al mismo tiempo. Con la función SYNC, todo está listo a la vez: más sabor,
        menos aceite y menos tiempo en la cocina.
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
      <h3 className="text-sm font-bold text-foreground mb-2">ESPECIFICACIONES TÉCNICAS:</h3>
      <div className="text-sm text-foreground mb-4 divide-y divide-border border border-border rounded-lg">
        {specs.map(([k, v]) => (
          <div key={k} className="flex justify-between px-3 py-2 gap-3">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium text-right">{v}</span>
          </div>
        ))}
      </div>
      <h3 className="text-sm font-bold text-foreground mb-2">CONTENIDO DE LA CAJA:</h3>
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
