import { useRef, useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";

export type Pillar = {
  icon: LucideIcon;
  img: string;
  title: string;
  text: string;
};

type Props = { pillars: Pillar[] };

export function PillarsMarquee({ pillars }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const isInteractingRef = useRef(false);
  const scrollPosRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

  const items = [...pillars, ...pillars];
  const speed = 40; // px/sec

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = (t: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t;
      const dt = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;

      if (track) {
        if (!isInteractingRef.current && !paused) {
          const half = track.scrollWidth / 2;
          scrollPosRef.current += speed * dt;
          if (scrollPosRef.current >= half) {
            scrollPosRef.current -= half;
          }
          track.scrollLeft = scrollPosRef.current;
        } else {
          scrollPosRef.current = track.scrollLeft;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, [paused]);

  const startInteraction = () => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
  };

  const endInteraction = () => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500);
  };

  const handleTap = (key: string) => {
    if (activeKey === key) {
      setActiveKey(null);
      setPaused(false);
    } else {
      setActiveKey(key);
      setPaused(true);
    }
  };

  return (
    <div
      className="relative w-full"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
      }}
    >
      <div
        ref={trackRef}
        onPointerDown={startInteraction}
        onTouchStart={startInteraction}
        onTouchEnd={endInteraction}
        onTouchCancel={endInteraction}
        onMouseDown={startInteraction}
        onMouseUp={endInteraction}
        onMouseLeave={endInteraction}
        onScroll={() => {
          if (trackRef.current && isInteractingRef.current) {
            scrollPosRef.current = trackRef.current.scrollLeft;
          }
        }}
        className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none active:cursor-grabbing cursor-grab touch-pan-x"
        style={{ width: "100%" }}
      >
        {items.map((p, i) => {
          const key = `${p.title}-${i}`;
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onPointerDown={() => handleTap(key)}
              onClick={() => handleTap(key)}
              className={`group relative w-[280px] sm:w-[320px] md:w-[360px] shrink-0 overflow-hidden rounded-3xl border bg-card text-left transition touch-pan-y ${
                isActive
                  ? "border-primary shadow-elevated -translate-y-1"
                  : "border-border hover:-translate-y-1 hover:shadow-elevated"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                <div className="absolute left-4 top-4 inline-grid h-11 w-11 place-items-center rounded-2xl bg-[var(--gradient-gold)] text-gold-foreground shadow-elevated">
                  <p.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {paused ? "Paused — tap again to resume" : "Tap a card to pause or drag to explore"}
      </p>
    </div>
  );
}
