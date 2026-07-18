import { useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type HItem = { text: string; img: string };

type Props = { items: HItem[]; speed?: number };

export function HorizontalAutoScroll({ items, speed = 50 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Animation state
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

  const list = [...items, ...items];

  const friction = 0.95;
  const minVelocity = 0.3;

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
        scrollPosRef.current = track.scrollLeft;
      } else if (Math.abs(velocityRef.current) > minVelocity) {
        // Momentum phase
        velocityRef.current *= friction;
        scrollPosRef.current += velocityRef.current;
        if (scrollPosRef.current >= half) scrollPosRef.current -= half;
        if (scrollPosRef.current < 0) scrollPosRef.current += half;
        track.scrollLeft = scrollPosRef.current;
      } else if (!isPausedRef.current) {
        // Auto-scroll
        velocityRef.current = 0;
        scrollPosRef.current += speed * dt;
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
  }, [speed]);

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

      if (dtMs > 0) {
        const moveDelta = lastDragXRef.current - e.clientX;
        velocityRef.current = (moveDelta / dtMs) * 16;
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

  // ── Arrow nudge ──
  const nudge = useCallback((dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;

    isPausedRef.current = true;
    velocityRef.current = 0;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);

    let target = track.scrollLeft + dir * 300;
    if (target < 0) target += half;
    if (target >= half) target -= half;

    track.scrollTo({ left: target, behavior: "smooth" });
    scrollPosRef.current = target;

    scheduleResume();
  }, [scheduleResume]);

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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ width: "100%" }}
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
                  draggable={false}
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
        <p className="text-xs text-muted-foreground">
          Swipe to explore · auto-scrolls when idle
        </p>
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
