import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type Facility = {
  icon: LucideIcon;
  img: string;
  title: string;
  desc: string;
};

type Props = { facilities: Facility[] };

export function FacilitiesScroll({ facilities }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const n = facilities.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((n - 1) / n) * 100}%`]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const currentCard = useTransform(scrollYProgress, (v) =>
    Math.min(n, Math.max(1, Math.round(v * (n - 1)) + 1))
  );

  return (
    <section
      ref={ref}
      className="relative scroll-smooth"
      style={{ height: `${n * 100}vh`, scrollBehavior: "smooth" }}
      aria-label="Facilities"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-page w-full">
          <div className="mb-6 sm:mb-10 flex items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Facilities
              </p>
              <h2 className="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-ink">
                Built around the way children actually learn.
              </h2>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 text-xs text-muted-foreground">
              <span className="font-medium tabular-nums text-ink">
                <motion.span>{currentCard}</motion.span>
                <span className="text-muted-foreground"> / {n}</span>
              </span>
              <span className="uppercase tracking-[0.2em]">Scroll to explore</span>
            </div>
          </div>

          {/* Scroll progress indicator */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-2">
              <span className="sm:hidden tabular-nums font-medium text-ink">
                <motion.span>{currentCard}</motion.span> of {n}
              </span>
              <span className="uppercase tracking-[0.2em] hidden sm:inline">Progress</span>
              <span className="uppercase tracking-[0.2em] sm:hidden">Swipe / scroll</span>
            </div>
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-border/60">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
              />
            </div>
          </div>

          <motion.div
            style={{ x, width: `${n * 100}%` }}
            className="flex"
          >
            {facilities.map((f, i) => (
              <FacilityCard key={f.title} facility={f} index={i} total={n} progress={scrollYProgress} />
            ))}
          </motion.div>
          <div className="mt-6 sm:mt-8 flex items-center justify-between">
            <DesktopDots facilities={facilities} progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── DOTS ─────────── */
function DesktopDots({
  facilities,
  progress,
}: {
  facilities: Facility[];
  progress: MotionValue<number>;
}) {
  const n = facilities.length;

  const handleDotClick = (index: number) => {
    const section = document.querySelector('[aria-label="Facilities"]') as HTMLElement;
    if (!section) return;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const targetScroll = sectionTop + (sectionHeight * index) / Math.max(1, n - 1);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-3">
      {facilities.map((_, i) => (
        <DesktopDot key={i} index={i} total={n} progress={progress} onClick={() => handleDotClick(i)} />
      ))}
    </div>
  );
}

function DesktopDot({
  index,
  total,
  progress,
  onClick,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  onClick: () => void;
}) {
  const center = total > 1 ? index / (total - 1) : 0.5;
  const span = total > 1 ? 0.5 / (total - 1) : 0.5;
  const lo = Math.max(0, center - span);
  const hi = Math.min(1, center + span);
  const width = useTransform(progress, [lo, center, hi], [12, 36, 12]);
  const opacity = useTransform(progress, [lo, center, hi], [0.35, 1, 0.35]);
  return (
    <motion.button
      style={{ width, opacity }}
      onClick={onClick}
      className="h-1.5 rounded-full bg-primary cursor-pointer hover:brightness-110"
      aria-label={`Go to facility ${index + 1}`}
    />
  );
}

/* ─────────── FACILITY CARD ─────────── */
function FacilityCard({
  facility,
  index,
  total,
  progress,
}: {
  facility: Facility;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const center = total > 1 ? index / (total - 1) : 0.5;
  const span = total > 1 ? 1 / (total - 1) : 1;
  const lo = Math.max(0, center - span);
  const hi = Math.min(1, center + span);
  const rotateY = useTransform(progress, [lo, center, hi], [35, 0, -35]);
  const scale = useTransform(progress, [lo, center, hi], [0.85, 1, 0.85]);
  const opacity = useTransform(progress, [lo, center, hi], [0.45, 1, 0.45]);

  return (
    <div className="flex shrink-0 items-center justify-center px-3 sm:px-4" style={{ width: `${100 / total}%` }}>
      <motion.div
        style={{ rotateY, scale, opacity, transformPerspective: 1200 }}
        className="group relative w-full max-w-md sm:max-w-xl md:max-w-3xl overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-elevated"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={facility.img} alt={facility.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          <div className="absolute left-3 sm:left-4 top-3 sm:top-4 inline-grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-white/90 text-primary shadow-elevated backdrop-blur">
            <facility.icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="absolute right-3 sm:right-4 top-3 sm:top-4 rounded-full bg-ink/70 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-ivory backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <h3 className="font-display text-xl sm:text-2xl text-ink">{facility.title}</h3>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{facility.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}
