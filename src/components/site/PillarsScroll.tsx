import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type Pillar = {
  icon: LucideIcon;
  img: string;
  title: string;
  text: string;
};

type Props = { pillars: Pillar[] };

export function PillarsScroll({ pillars }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Translate horizontally: show all cards across the viewport while pinned.
  // We move from 0% to -(n-1)/n * 100% so each card occupies full width.
  const n = pillars.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((n - 1) / n) * 100}%`]);

  return (
    <>
      {/* DESKTOP: pinned horizontal scroll with 3D effect */}
      <section
        ref={ref}
        className="relative hidden md:block"
        style={{ height: `${n * 100}vh` }}
        aria-label="Four pillars"
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container-page w-full">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Our Approach
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
                Four pillars that shape every Newtonian.
              </h2>
            </div>
            <motion.div
              style={{ x, width: `${n * 100}%` }}
              className="flex"
            >
              {pillars.map((p, i) => (
                <PillarCard key={p.title} pillar={p} index={i} total={n} progress={scrollYProgress} />
              ))}
            </motion.div>
            <div className="mt-8 flex gap-2">
              {pillars.map((_, i) => (
                <Dot key={i} index={i} total={n} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE: horizontal snap scroll */}
      <section className="container-page py-16 md:hidden">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Our Approach
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink">
            Four pillars that shape every Newtonian.
          </h2>
        </div>
        <div className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group relative w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                <div className="absolute left-4 top-4 inline-grid h-11 w-11 place-items-center rounded-2xl bg-white/90 text-primary shadow-elevated backdrop-blur">
                  <p.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Swipe to explore →</p>
      </section>
    </>
  );
}

function PillarCard({
  pillar,
  index,
  total,
  progress,
}: {
  pillar: Pillar;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Card is "active" when progress ~ index/(total-1)
  const center = total > 1 ? index / (total - 1) : 0.5;
  const span = total > 1 ? 1 / (total - 1) : 1;
  const lo = Math.max(0, center - span);
  const hi = Math.min(1, center + span);
  const rotateY = useTransform(progress, [lo, center, hi], [35, 0, -35]);
  const scale = useTransform(progress, [lo, center, hi], [0.85, 1, 0.85]);
  const opacity = useTransform(progress, [lo, center, hi], [0.45, 1, 0.45]);

  return (
    <div className="flex shrink-0 items-center justify-center px-6" style={{ width: `${100 / total}%` }}>
      <motion.div
        style={{ rotateY, scale, opacity, transformPerspective: 1200 }}
        className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-elevated"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={pillar.img} alt={pillar.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          <div className="absolute left-4 top-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-white/90 text-primary shadow-elevated backdrop-blur">
            <pillar.icon className="h-6 w-6" />
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-ivory backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>
        <div className="p-7">
          <h3 className="font-display text-2xl text-ink">{pillar.title}</h3>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">{pillar.text}</p>
        </div>
      </motion.div>
    </div>
  );
}

function Dot({ index, total, progress }: { index: number; total: number; progress: MotionValue<number> }) {
  const center = total > 1 ? index / (total - 1) : 0.5;
  const span = total > 1 ? 0.5 / (total - 1) : 0.5;
  const lo = Math.max(0, center - span);
  const hi = Math.min(1, center + span);
  const width = useTransform(progress, [lo, center, hi], [12, 36, 12]);
  const opacity = useTransform(progress, [lo, center, hi], [0.35, 1, 0.35]);
  return (
    <motion.span
      style={{ width, opacity }}
      className="h-1.5 rounded-full bg-primary"
    />
  );
}
