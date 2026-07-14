import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type HItem = { text: string; img: string };

type Props = { items: HItem[]; speed?: number };

export function HorizontalAutoScroll({ items, speed = 50 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  const list = [...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = (t: number) => {
      if (lastTRef.current == null) lastTRef.current = t;
      const dt = (t - lastTRef.current) / 1000;
      lastTRef.current = t;
      if (!paused) {
        const half = track.scrollWidth / 2;
        offsetRef.current += speed * dt;
        if (offsetRef.current >= half) offsetRef.current -= half;
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTRef.current = null;
    };
  }, [paused, speed]);

  const nudge = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    offsetRef.current = (offsetRef.current + dir * 320 + half) % half;
    track.style.transform = `translateX(-${offsetRef.current}px)`;
    setPaused(true);
  };

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="flex gap-5 will-change-transform"
          style={{ width: "max-content" }}
        >
          {list.map((it, i) => (
            <article
              key={`${it.text}-${i}`}
              className="w-[280px] sm:w-[320px] shrink-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-elevated transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={it.img}
                  alt={it.text}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-foreground/90">{it.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 h-10 text-xs font-medium hover:bg-accent transition"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
