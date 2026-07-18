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

  // Animation loop refs
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);

  // Velocity / momentum (for mouse drag only)
  const velocityRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTRef = useRef(0);

  // Resume timer
  const resumeTimerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  const items = [...pillars, ...pillars];
  const autoSpeed = 40; // px/sec
  const friction = 0.95; // momentum decay per frame
  const minVelocity = 0.3; // stop momentum below this

  // ── Main animation loop ──
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = (t: number) => {
      if (lastTRef.current == null) lastTRef.current = t;
      const dt = (t - lastTRef.current) / 1000;
      lastTRef.current = t;

      const half = track.scrollWidth / 2;

      if (isDraggingRef.current) {
        // While dragging, position is set by the pointer handler — just sync
        scrollPosRef.current = track.scrollLeft;
      } else if (Math.abs(velocityRef.current) > minVelocity) {
        // Momentum phase: decelerate after drag release
        velocityRef.current *= friction;
        scrollPosRef.current += velocityRef.current;
        // Wrap around
        if (scrollPosRef.current >= half) scrollPosRef.current -= half;
        if (scrollPosRef.current < 0) scrollPosRef.current += half;
        track.scrollLeft = scrollPosRef.current;
      } else if (!isPausedRef.current) {
        // Auto-scroll phase
        velocityRef.current = 0;
        scrollPosRef.current += autoSpeed * dt;
        if (scrollPosRef.current >= half) scrollPosRef.current -= half;
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

  // ── Schedule auto-scroll resume ──
  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
      if (trackRef.current) {
        scrollPosRef.current = trackRef.current.scrollLeft;
      }
    }, 2000);
  }, []);

  // ── Pointer handlers ──
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;

    isPausedRef.current = true;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);

    if (e.pointerType === "mouse") {
      isDraggingRef.current = true;
      velocityRef.current = 0;
      dragStartXRef.current = e.clientX;
      dragScrollStartRef.current = track.scrollLeft;
      lastDragXRef.current = e.clientX;
      lastDragTRef.current = performance.now();
      track.setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    if (e.pointerType === "mouse") {
      const now = performance.now();
      const dtMs = now - lastDragTRef.current;

      const dx = e.clientX - dragStartXRef.current;
      const newScroll = dragScrollStartRef.current - dx;
      track.scrollLeft = newScroll;
      scrollPosRef.current = newScroll;

      // Track instantaneous velocity for momentum
      if (dtMs > 0) {
        const moveDelta = lastDragXRef.current - e.clientX; // positive = scrolling right
        velocityRef.current = (moveDelta / dtMs) * 16; // px per frame (~16ms)
      }
      lastDragXRef.current = e.clientX;
      lastDragTRef.current = now;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (e.pointerType === "mouse") {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (track) {
        track.releasePointerCapture(e.pointerId);
        scrollPosRef.current = track.scrollLeft;
      }

      // Clamp velocity to prevent wild flings
      const maxVel = 30;
      velocityRef.current = Math.max(-maxVel, Math.min(maxVel, velocityRef.current));
    } else {
      if (track) {
        scrollPosRef.current = track.scrollLeft;
      }
    }

    scheduleResume();
  }, [scheduleResume]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    if (isPausedRef.current) {
      scrollPosRef.current = track.scrollLeft;
    }
  }, []);

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
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none cursor-grab active:cursor-grabbing"
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
        Swipe to explore · auto-scrolls when idle
      </p>
    </div>
  );
}
