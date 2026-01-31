import IsoLevelWarp from "@/components/ui/isometric-wave-grid-background";

export default function HeroPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* BACKGROUND: Isometric Wave Grid Animation */}
      <IsoLevelWarp color="100, 50, 250" density={50} speed={1.5} />

      {/* CONTENT LAYER */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            PROMETHEUS
          </span>
        </h1>
      </div>
    </div>
  );
}
