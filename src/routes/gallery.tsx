import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { SiteShell } from "@/components/site/SiteShell";
import { HeroBackground } from "@/components/site/HeroBackground";
import { db } from "@/lib/firebase";
import studentLife from "@/assets/student-life.jpg";
import sports from "@/assets/sports.jpg";
import cultural from "@/assets/cultural.jpg";
import lab from "@/assets/computer-lab.jpg";
import independence from "@/assets/independence.jpg";
import hero from "@/assets/hero-classroom.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Newton English Medium School" },
      {
        name: "description",
        content:
          "Moments from festivals, special events, classrooms and student activities at Newton EM School.",
      },
      { property: "og:title", content: "Gallery — Newton EM School" },
      {
        property: "og:description",
        content: "Look inside our classrooms, sports days and cultural celebrations.",
      },
    ],
  }),
  component: GalleryPage,
});

type Cat = "Festivals" | "Events" | "School" | "Activities";
type Item = { src: string; title: string; cat: Cat };

const fallbackItems: Item[] = [
  { src: independence, title: "Independence Day", cat: "Festivals" },
  { src: cultural, title: "Annual Cultural Day", cat: "Festivals" },
  { src: studentLife, title: "Classroom Energy", cat: "School" },
  { src: hero, title: "Smart Classroom", cat: "School" },
  { src: sports, title: "Sports Meet", cat: "Activities" },
  { src: lab, title: "Computer Lab", cat: "School" },
  { src: cultural, title: "Krishnastami", cat: "Festivals" },
  { src: independence, title: "Republic Day Parade", cat: "Events" },
  { src: studentLife, title: "Prayer Assembly", cat: "School" },
  { src: sports, title: "Inter-Class Football", cat: "Activities" },
  { src: lab, title: "Science Expo", cat: "Events" },
  { src: hero, title: "Teachers' Day", cat: "Events" },
];

const cats = ["All", "Festivals", "Events", "School", "Activities"] as const;

function GalleryPage() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [open, setOpen] = useState<Item | null>(null);
  const [remote, setRemote] = useState<Item[] | null>(null);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Item[] = snap.docs.map((d) => {
          const v = d.data() as { url: string; title: string; category: string };
          return { src: v.url, title: v.title, cat: (v.category as Cat) ?? "School" };
        });
        setRemote(data);
      },
      () => setRemote([]),
    );
    return () => unsub();
  }, []);

  // Always keep built-in gallery images; append admin uploads on top.
  const items = remote && remote.length > 0
    ? [
        ...remote,
        ...fallbackItems.filter(
          (f) => !remote.some((r) => r.src === f.src && r.title === f.title),
        ),
      ]
    : fallbackItems;


  const filtered = useMemo(
    () => (cat === "All" ? items : items.filter((i) => i.cat === cat)),
    [cat, items],
  );

  return (
    <SiteShell>
      <HeroBackground images={[hero, studentLife, cultural, sports, lab, independence]} minHeight="min-h-[55vh]">
        <div className="container-page relative z-10 flex min-h-[55vh] flex-col justify-center pt-28 pb-12 text-ivory sm:pt-36">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Gallery
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl lg:text-7xl max-w-3xl leading-tight">
            Moments that make Newton, <span className="text-gradient-gold">Newton.</span>
          </h1>
        </div>
      </HeroBackground>

      <section className="container-page pt-8 pb-12">

        <div className="mt-10 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                cat === c
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "border border-border hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((it, i) => (
              <motion.button
                layout
                key={it.title + i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => setOpen(it)}
                className={`group relative overflow-hidden rounded-3xl ${
                  i % 5 === 0 ? "sm:row-span-2 aspect-[3/4]" : "aspect-[4/3]"
                }`}
              >
                <img
                  src={it.src}
                  alt={it.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left text-ivory">
                  <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] backdrop-blur">
                    {it.cat}
                  </span>
                  <div className="mt-2 font-display text-xl">{it.title}</div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/85 backdrop-blur p-4"
          >
            <button
              className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-ivory hover:bg-white/20"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={open.src}
              alt={open.title}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
