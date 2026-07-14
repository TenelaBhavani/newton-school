import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CarouselItem = {
  icon: LucideIcon;
  img: string;
  title: string;
  desc: string;
};

type Props = { items: CarouselItem[]; autoMs?: number };

export function Carousel3D({ items, autoMs = 3500 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const n = items.length;
  const dragX = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((p) => (p + 1) % n), autoMs);
    return () => clearInterval(id);
  }, [paused, n, autoMs]);

  const go = (dir: number) => setActive((p) => (p + dir + n) % n);

  // Responsive 3D values — larger cards for the facilities carousel
  const isXSmall = isMobile && typeof window !== 'undefined' && window.innerWidth < 360;
  const cardW = isMobile ? (isXSmall ? 230 : 260) : 380;
  const gapX = isMobile ? (isXSmall ? 140 : 170) : 320;
  const depthZ = isMobile ? 140 : 240;
  const rotate = isMobile ? 18 : 28;
  const containerH = isMobile ? "380px" : "560px";

  return (
    <div
      className="relative w-full"
      style={{ minHeight: containerH }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative mx-auto w-full"
        style={{ height: containerH, perspective: "1200px", perspectiveOrigin: "50% 50%" }}
        onTouchStart={(e) => (dragX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (dragX.current == null) return;
          const dx = e.changedTouches[0].clientX - dragX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          dragX.current = null;
        }}
      >
        {items.map((item, idx) => {
          let offset = idx - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;

          const abs = Math.abs(offset);
          const isActive = offset === 0;

          const translateX = offset * gapX;
          const translateZ = -abs * depthZ;
          const rotateY = -offset * rotate;
          const opacity = abs > 2 ? 0 : 1 - abs * 0.35;
          const scale = isActive ? 1 : 1 - abs * 0.1;
          const zIndex = 100 - abs;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={item.title}
              className="absolute left-1/2 top-1/2 cursor-pointer transition-all duration-700 ease-out"
              style={{
                width: cardW,
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
            >
              <div
                className={`overflow-hidden rounded-2xl border bg-card text-left shadow-elevated transition ${
                  isActive ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                  <div className="absolute left-3 top-3 inline-grid h-9 w-9 place-items-center rounded-xl bg-white/90 text-primary shadow-elevated backdrop-blur">
                    <item.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-base sm:text-lg text-ink leading-tight">{item.title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-accent transition"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-accent transition"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
