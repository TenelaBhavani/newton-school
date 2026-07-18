import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { HeroBackground } from "@/components/site/HeroBackground";
import independence from "@/assets/independence.jpg";
import cultural from "@/assets/cultural.jpg";
import sports from "@/assets/sports.jpg";
import lab from "@/assets/computer-lab.jpg";
import studentLife from "@/assets/student-life.jpg";
import { useCollection, type EventDoc } from "@/lib/admin-content";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | Newton English Medium School" },
      {
        name: "description",
        content:
          "Upcoming celebrations, exams, parent-teacher meets and special programs at Newton EM School.",
      },
      { property: "og:title", content: "Events at Newton EM School" },
      {
        property: "og:description",
        content: "What's on at school this season — festivals, expos and meets.",
      },
    ],
  }),
  component: EventsPage,
});

type EventItem = { img: string; title: string; date: string; place: string; desc: string };

const fallbackEvents: EventItem[] = [
  { img: cultural, title: "Annual Cultural Day", date: "15 Dec 2025", place: "School Auditorium", desc: "An evening of dance, drama and music celebrating the spirit of Newton." },
  { img: sports, title: "Inter-School Sports Meet", date: "08 Jan 2026", place: "School Grounds", desc: "Track, ball games and team events for classes V–X." },
  { img: lab, title: "Science & Innovation Expo", date: "22 Jan 2026", place: "Block B Lab Wing", desc: "Student-built projects on energy, AI and the environment." },
  { img: independence, title: "Republic Day Celebration", date: "26 Jan 2026", place: "Main Assembly Ground", desc: "Flag hoisting, parade and patriotic performances." },
  { img: studentLife, title: "Parent-Teacher Meet", date: "12 Feb 2026", place: "Respective Classrooms", desc: "Term progress reviews and one-on-one conversations." },
];

function EventsPage() {
  const { items, loading } = useCollection<EventDoc>("events");

  const events: EventItem[] = items.length
    ? items.map((e) => ({
        img: e.imageUrl || cultural,
        title: e.title,
        date: e.date,
        place: e.place,
        desc: e.desc,
      }))
    : loading ? [] : fallbackEvents;

  return (
    <SiteShell>
      <HeroBackground images={[cultural, sports, independence, lab, studentLife]} minHeight="min-h-[55vh]">
        <div className="container-page relative z-10 flex min-h-[55vh] flex-col justify-center pt-28 pb-12 text-ivory sm:pt-36">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Events</p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl lg:text-7xl max-w-3xl leading-tight">
            What's <span className="text-gradient-gold">happening</span> at Newton.
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-ivory/90">
            A look at the upcoming celebrations, academic milestones and family moments at our campus.
          </p>
        </div>
      </HeroBackground>

      <section className="container-page pt-16 sm:pt-20 pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <motion.article
              key={`${e.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card hover:-translate-y-1 hover:shadow-elevated transition"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={e.img} alt={e.title} loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> {e.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {e.place}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl text-ink">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
