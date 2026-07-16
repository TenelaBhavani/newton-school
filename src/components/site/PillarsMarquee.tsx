import { useRef, useCallback, useEffect } from "react";
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

  // Refs for the animation loop & interaction state
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);

  // Resume timer
  const resumeTimerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  const items = [...pillars, ...pillars];
  const speed = 40; // px/sec

  // ── Auto-scroll loop ──
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = (t: number) => {
      if (lastTRef.current == null) lastTRef.current = t;
      const dt = (t - lastTRef.current) / 1000;
      lastTRef.current = t;

      if (!isPausedRef.current && !isDraggingRef.current) {
        const half = track.scrollWidth / 2;
        scrollPosRef.current += speed * dt;
        if (scrollPosRef.current >= half) {
          scrollPosRef.current -= half;
        }
        track.scrollLeft = scrollPosRef.current;
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTRef.current = null;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // ── Schedules auto-scroll resume after delay ──
  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
      // Sync position so it doesn't jump
      if (trackRef.current) {
        scrollPosRef.current = trackRef.current.scrollLeft;
      }
    }, 1500);
  }, []);

  // ── Pointer / Touch handlers for drag ──
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;

    isDraggingRef.current = true;
    isPausedRef.current = true;
    dragStartXRef.current = e.clientX;
    dragScrollStartRef.current = track.scrollLeft;

    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);

    // Capture pointer so moves outside the element still fire
    track.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - dragStartXRef.current;
    const newScroll = dragScrollStartRef.current - dx;
    track.scrollLeft = newScroll;
    scrollPosRef.current = newScroll;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const track = trackRef.current;
    if (track) {
      track.releasePointerCapture(e.pointerId);
      scrollPosRef.current = track.scrollLeft;
    }

    scheduleResume();
  }, [scheduleResume]);

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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none cursor-grab active:cursor-grabbing touch-none"
        style={{ width: "100%" }}
      >
        {items.map((p, i) => {
          const key = `${p.title}-${i}`;
          return (
            <div
              key={key}
              className="group relative w-[280px] sm:w-[320px] md:w-[360px] shrink-0 overflow-hidden rounded-3xl border border-border bg-card text-left transition hover:-translate-y-1 hover:shadow-elevated"
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
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Drag to explore · auto-scrolls when idle
      </p>
    </div>
  );
}
