import { Eye } from "lucide-react";
import { useState, useEffect } from "react";

const ViewerCount = () => {
  const [count, setCount] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => Math.max(12, c + Math.floor(Math.random() * 7) - 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-primary/5">
      <Eye className="w-4 h-4 text-primary" />
      <span className="text-xs text-primary font-semibold">
        🔥 {count} pessoas comprando agora
      </span>
    </div>
  );
};

export default ViewerCount;
