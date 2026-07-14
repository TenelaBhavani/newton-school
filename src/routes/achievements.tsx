import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Counter } from "@/components/site/Counter";
import { HeroBackground } from "@/components/site/HeroBackground";
import heroImg from "@/assets/hero-classroom.jpg";
import sLife from "@/assets/student-life.jpg";
import cul from "@/assets/cultural.jpg";
import sp from "@/assets/sports.jpg";
import lab from "@/assets/computer-lab.jpg";
import indep from "@/assets/independence.jpg";
import { useCollection, type AchievementDoc } from "@/lib/admin-content";

const yearImages: Record<string, string> = {
  "2024-25": heroImg,
  "2023-24": lab,
  "2022-23": cul,
  "2021-22": sp,
  "2020-21": indep,
};
const fallbackYearImg = sLife;

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements | Newton English Medium School" },
      {
        name: "description",
        content:
          "Academic toppers, alumni success stories, awards and the numbers that define Newton EM School.",
      },
      { property: "og:title", content: "Achievements at Newton EM School" },
      {
        property: "og:description",
        content:
          "Two decades of consistent results, proud alumni and recognised excellence.",
      },
    ],
  }),
  component: AchievementsPage,
});

const alumni = [
  { name: "R. Pavani", where: "Google, Hyderabad", note: "Software Engineer" },
  { name: "K. Srinivas", where: "Indian Navy", note: "Officer" },
  { name: "M. Lakshmi", where: "Andhra Medical College", note: "MBBS" },
  { name: "S. Karthik", where: "IIT Madras", note: "B.Tech CSE" },
];

const fallbackYearly: Record<string, { title: string; text: string; imageUrl?: string }[]> = {
  "2024-25": [
    { title: "100% pass in 10ᵗʰ Class", text: "Every student cleared with strong scores.", imageUrl: heroImg },
    { title: "District-level Quiz Winners", text: "Team of four bagged the top prize.", imageUrl: lab },
  ],
  "2023-24": [
    { title: "12 students scored 9+ CGPA", text: "Across 10ᵗʰ board examinations.", imageUrl: sLife },
    { title: "State-level Science Fair Finalists", text: "Two projects selected.", imageUrl: lab },
  ],
  "2021-22": [
    { title: "Online learning excellence award", text: "Recognised by district education board.", imageUrl: indep },
  ],
};

function AchievementsPage() {
  const { items } = useCollection<AchievementDoc>("achievements");
    const yearly = useMemo(() => {
    // Start from built-in fallback so old achievements always stay.
    const out: Record<string, { title: string; text: string; imageUrl?: string }[]> = {};
    for (const y of Object.keys(fallbackYearly)) {
      out[y] = fallbackYearly[y].map((a) => ({ ...a }));
    }
    for (const a of items) {
      const isCultural = a.title.toLowerCase().includes("cultural");
      (out[a.year] ??= []).push({ title: a.title, text: a.text, imageUrl: isCultural ? undefined : a.imageUrl });
    }
    return out;
  }, [items]);
  // Sort years descending so newest is first (e.g. "2025-26" before "2024-25").
  const years = useMemo(() => Object.keys(yearly).sort((a, b) => b.localeCompare(a)), [yearly]);
  const [year, setYear] = useState<string | null>(null);
  // When admin adds a new achievement, jump to that year automatically.
  useEffect(() => {
    if (!year && items.length > 0) setYear(items[0].year);
  }, [items, year]);
  const activeYear = (year && yearly[year]) ? year : years[0];


  return (
    <SiteShell>
      <HeroBackground images={[heroImg, sLife, cul, sp]} minHeight="min-h-[55vh]">
        <div className="container-page relative z-10 flex min-h-[55vh] flex-col justify-center py-12 text-ivory">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Achievements
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl lg:text-7xl max-w-4xl leading-tight">
            Results that <span className="text-gradient-gold">speak.</span> Stories
            that inspire.
          </h1>
        </div>
      </HeroBackground>

      {/* Stats */}
      <section className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 25, s: "+", l: "Dedicated Teachers" },
            { v: 1000, s: "+", l: "Happy Parents" },
            { v: 10000, s: "+", l: "Students" },
            { v: 20, s: "", l: "10ᵗʰ Batches" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-3xl border border-border bg-card p-8 text-center"
            >
              <div className="font-display text-5xl text-gradient-hero">
                <Counter to={s.v} suffix={s.s} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alumni — single static card */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Our Alumni
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
            Where Newtonians go next.
          </h2>
        </div>
        <div className="mt-10 relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-ink-gradient text-ivory p-5 sm:p-10 lg:p-14">
          <Trophy className="h-8 w-8 text-gold" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {alumni.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-ivory/15 bg-white/5 p-6 backdrop-blur"
              >
                <p className="font-display text-2xl sm:text-3xl leading-tight">{a.name}</p>
                <p className="mt-3 text-sm text-ivory/80">{a.note}</p>
                <p className="text-gold text-sm mt-1">{a.where}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Yearly Achievements */}
      <section className="container-page py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Academic Year Highlights
        </p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
          Browse achievements by year.
        </h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                year === y
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "border border-border hover:bg-accent"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {(() => {
          const list = yearly[activeYear] ?? [];
          const firstUploaded = list.find((a) => a.imageUrl)?.imageUrl;
          const bannerImg = firstUploaded ?? yearImages[activeYear] ?? fallbackYearImg;
          return (
            <div className="mt-10 grid items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              <motion.div
                key={`img-${activeYear}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[280px] overflow-hidden rounded-2xl shadow-elevated sm:h-[380px] sm:rounded-3xl lg:h-[520px]"
              >
                <img
                  src={bannerImg}
                  alt={`Highlights ${activeYear}`}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute left-5 bottom-5 text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Academic Year</p>
                  <p className="font-display text-3xl">{activeYear}</p>
                </div>
              </motion.div>

              <div className="mx-auto grid w-full max-w-[620px] min-w-0 grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr sm:gap-5 lg:max-w-[680px]">
                {list.map((a, i) => {
                  const isCultural = a.title.toLowerCase().includes("cultural");
                  return (
                    <motion.div
                      key={a.title + i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl"
                    >
                      {!isCultural && (
                        <div className="aspect-square w-full overflow-hidden bg-muted sm:aspect-[4/3]">
                          <img
                            src={a.imageUrl ?? yearImages[activeYear] ?? fallbackYearImg}
                            alt={a.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-7">
                        <Award className="h-5 w-5 shrink-0 text-gold sm:h-7 sm:w-7" />
                        <h3 className="mt-3 break-words font-display text-sm leading-snug text-ink sm:mt-4 sm:text-xl">
                          {a.title}
                        </h3>
                        <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {a.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>

    </SiteShell>
  );
}
