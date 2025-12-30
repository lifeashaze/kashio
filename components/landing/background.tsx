export function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-transparent to-chart-3/[0.05]" />
      
      {/* Animated orbs */}
      <div className="absolute -left-[20%] top-[10%] h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-primary/30 via-chart-1/20 to-transparent blur-[100px]" />
      <div 
        className="absolute -right-[15%] top-[30%] h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-bl from-chart-2/25 via-chart-3/15 to-transparent blur-[90px]" 
        style={{ animationDelay: "1s", animationDuration: "4s" }} 
      />
      <div 
        className="absolute bottom-[10%] left-[20%] h-[450px] w-[450px] animate-pulse rounded-full bg-gradient-to-tr from-chart-4/20 via-primary/15 to-transparent blur-[80px]" 
        style={{ animationDelay: "2s", animationDuration: "5s" }} 
      />
      <div 
        className="absolute -bottom-[10%] right-[30%] h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-t from-chart-1/15 to-transparent blur-[70px]" 
        style={{ animationDelay: "0.5s", animationDuration: "6s" }} 
      />
      
      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(at 20% 30%, hsl(var(--chart-1) / 0.1) 0px, transparent 50%),
                            radial-gradient(at 80% 20%, hsl(var(--chart-2) / 0.08) 0px, transparent 50%),
                            radial-gradient(at 40% 80%, hsl(var(--primary) / 0.1) 0px, transparent 50%),
                            radial-gradient(at 90% 70%, hsl(var(--chart-3) / 0.06) 0px, transparent 50%)`,
        }}
      />
      
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.15) 1px, transparent 1px), 
                            linear-gradient(90deg, hsl(var(--foreground) / 0.15) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" 
        }} 
      />
    </div>
  );
}

