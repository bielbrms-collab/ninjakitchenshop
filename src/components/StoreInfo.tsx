import ninjaMain from "@/assets/ninja-image.png.asset.json";
const ls2Logo = ninjaMain.url;

const StoreInfo = () => {
  return (
    <div className="px-4 py-4 bg-background border-t-4 border-secondary">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={ls2Logo}
            alt="Ninja"
            className="w-12 h-12 rounded-full object-cover border border-border bg-white"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold">Ninja Oficial</h3>
          <p className="text-xs text-muted-foreground">6,0 mil vendido(s)</p>
        </div>
        <button className="px-4 py-1.5 border border-primary text-primary text-xs font-semibold rounded-full">
          Visitar
        </button>
      </div>
    </div>
  );
};

export default StoreInfo;
