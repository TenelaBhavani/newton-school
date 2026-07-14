import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  Heart,
  Cpu,
  Camera,
  ShieldCheck,
  Clock,
  Users,
  GraduationCap,
  Quote,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Carousel3D } from "@/components/site/Carousel3D";
import { PillarsMarquee } from "@/components/site/PillarsMarquee";
import { HeroBackground } from "@/components/site/HeroBackground";
import { Counter } from "@/components/site/Counter";
import heroImg from "@/assets/hero-classroom.jpg";
import studentLife from "@/assets/student-life.jpg";
import sports from "@/assets/sports.jpg";
import cultural from "@/assets/cultural.jpg";
import lab from "@/assets/computer-lab.jpg";
import pillarTime from "@/assets/pillar-time.jpg";
import pillarCreative from "@/assets/pillar-creative.jpg";
import pillarSports from "@/assets/pillar-sports.jpg";
import pillarGoal from "@/assets/pillar-goal.jpg";
import facSmart from "@/assets/facility-smart.jpg";
import facStudy from "@/assets/facility-study.jpg";
import facCctv from "@/assets/facility-cctv.jpg";
import facSports from "@/assets/facility-sports.jpg";
import facClass from "@/assets/facility-class.jpg";
import facParent from "@/assets/facility-parent.jpg";
import { SCHOOL } from "@/lib/school";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Newton English Medium School | Excellence Since 2000" },
      {
        name: "description",
        content:
          "Premier English medium school in Visakhapatnam nurturing creativity, discipline and academic excellence since 2000. Admissions open.",
      },
      {
        property: "og:title",
        content: "Newton English Medium School — Shaping Future Leaders",
      },
      {
        property: "og:description",
        content:
          "Smart classrooms, dedicated teachers, structured study hours and a culture of care in Kancharapalem, Visakhapatnam.",
      },
    ],
  }),
  component: HomePage,
});

const facilities = [
  { icon: Cpu, img: facSmart, title: "Smart Classrooms", desc: "Digital boards and interactive learning that brings every lesson to life." },
  { icon: BookOpen, img: facStudy, title: "Structured Study Hours", desc: "Supervised study time so every child builds focus and confidence." },
  { icon: Camera, img: facCctv, title: "CCTV Monitoring", desc: "Every corridor watched over — your child's safety is non‑negotiable." },
  { icon: Trophy, img: facSports, title: "Sports & Activities", desc: "Daily play, inter‑school meets and team spirit on and off the field." },
  { icon: Users, img: facClass, title: "Max 30 Per Class", desc: "Small batches mean every child is seen, heard and guided personally." },
  { icon: ShieldCheck, img: facParent, title: "Parent Connect", desc: "SMS, calls and regular PTMs — you're always in the loop." },
];

const pillars = [
  { icon: Clock, img: pillarTime, title: "Time Management", text: "Children learn to plan, prioritise and use every hour with purpose." },
  { icon: Sparkles, img: pillarCreative, title: "Creative Education", text: "Curiosity-led learning that turns lessons into discovery." },
  { icon: Trophy, img: pillarSports, title: "Sports & Activities", text: "Active bodies, sharper minds, and a love for teamwork." },
  { icon: Heart, img: pillarGoal, title: "Goal Oriented", text: "Clear milestones, gentle accountability, lasting confidence." },
];

const heroSlides = [heroImg, studentLife, cultural, sports, lab, facSmart];

function HomePage() {
  return (
    <SiteShell>
      {/* ============ HERO ============ */}
      <HeroBackground images={heroSlides} minHeight="min-h-[88vh]">
        <div className="container-page relative z-10 flex min-h-[88vh] flex-col items-center justify-center pt-12 pb-16 text-center text-ivory">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-ivory backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Admissions open · Academic Year 2026–27
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 max-w-4xl font-display text-3xl sm:text-5xl lg:text-7xl font-semibold leading-[1.05]"
          >
            Shaping future leaders through{" "}
            <span className="text-gradient-gold">excellence</span> in education.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-ivory/90 leading-relaxed"
          >
            Nurturing creativity, discipline, confidence and academic excellence
            since {SCHOOL.established}. A place in Visakhapatnam where every child
            is known by name and grown with care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-3"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 transition"
            >
              <GraduationCap className="h-4 w-4" />
              Enroll Your Child
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-ivory backdrop-blur hover:bg-white/20 transition"
            >
              Explore Campus
            </Link>
          </motion.div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-sm">
            <div>
              <div className="font-display text-3xl font-semibold text-ivory">
                <Counter to={25} suffix="+" />
              </div>
              <div className="text-ivory/75">Years of Trust</div>
            </div>
            <div className="h-10 w-px bg-ivory/30" />
            <div>
              <div className="font-display text-3xl font-semibold text-ivory">
                <Counter to={10000} suffix="+" />
              </div>
              <div className="text-ivory/75">Students Mentored</div>
            </div>
            <div className="h-10 w-px bg-ivory/30 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="font-display text-3xl font-semibold text-ivory">
                <Counter to={20} />
              </div>
              <div className="text-ivory/75">10ᵗʰ Batches</div>
            </div>
          </div>
        </div>
      </HeroBackground>

      {/* Marquee */}
      <div className="border-y border-border bg-card/50">
        <div className="overflow-hidden py-4">
          <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 gap-12">
                <span>★ Admissions Open 2026–27</span>
                <span>★ Smart Digital Classrooms</span>
                <span>★ Limited to 30 Students per Class</span>
                <span>★ Education is Light of Life</span>
                <span>★ Since 2000 in Visakhapatnam</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ============ PILLARS ============ */}
      <section className="container-page py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Our Approach
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
            Four pillars that shape every Newtonian.
          </h2>
        </div>
        <div className="mt-12">
          <PillarsMarquee pillars={pillars} />
        </div>

      </section>

      {/* ============ STUDENT LIFE ============ */}
      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { img: studentLife, tag: "Classrooms", title: "Curious minds, every day" },
            { img: sports, tag: "Sports", title: "Play hard, learn harder" },
            { img: cultural, tag: "Culture", title: "Festivals, stages, applause" },
            { img: lab, tag: "Innovation", title: "Where ideas take shape" },
          ].map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={card.img}
                alt={card.title}
                loading="lazy"
                className="h-[300px] sm:h-[420px] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">
                  {card.tag}
                </span>
                <h3 className="mt-3 font-display text-2xl leading-tight">{card.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============ FACILITIES — 3D CAROUSEL ============ */}
      <section className="container-page py-24 overflow-hidden">
        <div className="mb-10 mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Facilities
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
            Built around the way children actually learn.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Drag, swipe or use the arrows — hover to pause.
          </p>
        </div>
        <div className="mx-auto flex w-full justify-center px-2 sm:px-4">
          <Carousel3D items={facilities} />
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="container-page py-24">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-ink-gradient p-5 sm:p-10 lg:p-16 text-ivory">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(500px circle at 20% 0%, oklch(0.55 0.21 25 / 0.6), transparent 60%), radial-gradient(400px circle at 90% 100%, oklch(0.82 0.16 85 / 0.4), transparent 60%)",
            }}
          />
          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: 25, s: "+", l: "Dedicated Teachers" },
              { v: 1000, s: "+", l: "Happy Parents" },
              { v: 10000, s: "+", l: "Students Mentored" },
              { v: 20, s: "", l: "10ᵗʰ Class Batches" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-gradient-gold">
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div className="mt-2 text-sm uppercase tracking-[0.18em] text-ivory/70">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL ============ */}
      <section className="container-page py-16 overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative"
          >
            <img
              src={lab}
              alt="Computer lab"
              loading="lazy"
              className="rounded-3xl shadow-elevated w-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          >
            <Quote className="h-10 w-10 text-primary" />
            <p className="mt-6 font-display text-3xl sm:text-4xl leading-snug text-ink">
              "At Newton, education goes beyond academics — it is about shaping
              character, inspiring confidence, and preparing young minds to lead
              with wisdom and empathy."
            </p>
            <div className="mt-6">
              <p className="font-semibold text-ink">Mrs. B. Mithu</p>
              <p className="text-sm text-muted-foreground">
                State Admn. Secretary · M.A, B.Ed
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="container-page py-24">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-hero-gradient p-6 sm:p-12 lg:p-20 text-ivory text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ivory/80">
            Admissions 2026–27
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">
            Give your child a future they'll thank you for.
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-ivory/85">
            Limited seats per class. Visit our campus or send an enquiry — we'll
            walk you through everything.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-semibold text-primary shadow-elevated hover:scale-[1.02] transition"
            >
              <GraduationCap className="h-4 w-4" /> Enroll Now
            </Link>
            <a
              href={`tel:${SCHOOL.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-full border border-ivory/40 px-7 py-3.5 text-sm font-semibold text-ivory hover:bg-ivory/10 transition"
            >
              Call {SCHOOL.phone}
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
