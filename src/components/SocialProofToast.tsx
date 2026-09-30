import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";

const names = [
  "María", "José", "Ana", "Carlos", "Lucía", "Pablo", "Laura", "Pedro",
  "Carmen", "Javier", "Marta", "Sergio", "Elena", "Diego", "Paula",
];
const cities = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza",
  "Málaga", "Murcia", "Bilbao", "Alicante", "Valladolid", "Granada",
];

const SocialProofToast = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const show = () => {
      setName(names[Math.floor(Math.random() * names.length)]);
      setCity(cities[Math.floor(Math.random() * cities.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    // First show after 8s
    const first = setTimeout(show, 8000);
    const interval = setInterval(show, 15000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-3 z-40 animate-in slide-in-from-left duration-300">
      <div className="flex items-center gap-2 bg-foreground text-background px-3 py-2 rounded-lg shadow-lg max-w-[280px]">
        <ShoppingBag className="w-4 h-4 shrink-0" />
        <p className="text-xs">
          <span className="font-bold">{name}</span> de {city} acaba de comprar!
        </p>
      </div>
    </div>
  );
};

export default SocialProofToast;
