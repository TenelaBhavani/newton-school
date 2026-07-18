import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import { HeroBackground } from "@/components/site/HeroBackground";
import { HorizontalAutoScroll } from "@/components/site/HorizontalAutoScroll";
import classroom from "@/assets/hero-classroom.jpg";
import studentLife from "@/assets/student-life.jpg";
import cultural from "@/assets/cultural.jpg";
import computerLab from "@/assets/computer-lab.jpg";
import sports from "@/assets/sports.jpg";
import facCctv from "@/assets/facility-cctv.jpg";
import facParent from "@/assets/facility-parent.jpg";
import facStudy from "@/assets/facility-study.jpg";
import facClass from "@/assets/facility-class.jpg";
import facSmart from "@/assets/facility-smart.jpg";
import pillarTime from "@/assets/pillar-time.jpg";
import pillarCreative from "@/assets/pillar-creative.jpg";
import pillarGoal from "@/assets/pillar-goal.jpg";
import { useAboutContent, useCollection, type FacultyDoc } from "@/lib/admin-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Newton English Medium School" },
      {
        name: "description",
        content:
          "Our mission, values, leadership and the journey of Newton English Medium School since 2000 in Visakhapatnam.",
      },
      { property: "og:title", content: "About Newton English Medium School" },
      {
        property: "og:description",
        content:
          "Discover our vision, values, and the dedicated team shaping young minds at Newton EM School.",
      },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  { year: "2000", title: "Founded in Kancharapalem", text: "Doors opened with a vision for accessible quality education." },
  { year: "2008", title: "Digital classrooms introduced", text: "Smart boards transform daily teaching." },
  { year: "2015", title: "10,000ᵗʰ student milestone", text: "A growing family of curious, confident young learners." },
  { year: "2020", title: "20ᵗʰ 10ᵗʰ batch graduates", text: "Two decades of consistent academic results." },
  { year: "Today", title: "A modern campus, timeless values", text: "Discipline, creativity and care — for every child." },
];

const values = ["Integrity", "Respect", "Excellence", "Innovation"];

const keyFacts = [
  { text: "Priority to discipline and a pleasant atmosphere to learn.", img: classroom },
  { text: "Intimation to parents about absenteeism via phone call / SMS.", img: facParent },
  { text: "Monitoring of students through C.C. cameras.", img: facCctv },
  { text: "Structured study hours under tutor supervision.", img: facStudy },
  { text: "Regular practice & class tests for all classes.", img: facClass },
  { text: "Weekly, monthly, and annual exams with prefinals.", img: facSmart },
  { text: "Parent-teacher meetings at regular intervals.", img: facParent },
  { text: "Personality and soft skills development.", img: studentLife },
  { text: "Digital class & computer lab facilities.", img: computerLab },
  { text: "Online exams conducted during holidays.", img: facSmart },
  { text: "Limited to 30 students per class.", img: facClass },
  { text: "Aptitude, reasoning & G.K. classes (VI–VIII).", img: pillarGoal },
  { text: "Emphasis on reading skills & handwriting.", img: pillarCreative },
  { text: "Bilingual (English & Hindi) communication.", img: pillarTime },
  { text: "Encouragement in cultural & competitive activities.", img: cultural },
];

function AboutPage() {
  const content = useAboutContent();
  const { items: dbFaculty } = useCollection<FacultyDoc>("faculty");
  const mission = content?.mission?.trim() || "To prepare every student to face global educational challenges with confidence — through engaging academics, modern resources and a culture rooted in care.";
  const vision = content?.vision?.trim() || "An education that goes beyond grades — building responsible citizens who think clearly, act kindly and lead with integrity.";
  const principalQuote = content?.principalQuote?.trim() || "Welcome to Newton's EM School — where we not only educate minds but nurture hearts. Students are instilled with core values like honesty, kindness, generosity, courage, freedom and respect.";
  const principalBio = content?.principalBio?.trim() || "Established in 2000, we have been committed to providing quality education and holistic development. Our dedicated team works tirelessly to create a nurturing environment where every child can thrive.";

  return (
    <SiteShell>
      <HeroBackground images={[classroom, studentLife, cultural, computerLab, sports]} minHeight="min-h-[56vh] sm:min-h-[62vh]">
        <div className="container-page relative z-10 flex min-h-[56vh] flex-col justify-center pt-28 pb-10 text-ivory sm:min-h-[62vh] sm:pt-36 sm:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold sm:tracking-[0.25em]">
            About Newton
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight sm:text-7xl">
            For tomorrow's dream, <span className="text-gradient-gold">plan today.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/90 sm:mt-6 sm:text-lg">
            At Newton, we transform education through innovative methods that nurture
            young minds with essential skills in learning, reading and communication.
          </p>
        </div>
      </HeroBackground>

      {/* Mission / Vision */}
      <section className="container-page py-10 sm:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          {/* Image collage — clean structured grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <img
                src={classroom}
                alt="Newton students engaged in a vibrant classroom"
                loading="lazy"
                className="col-span-2 aspect-[16/9] w-full rounded-2xl sm:rounded-3xl object-cover shadow-elevated"
              />
              <img
                src={cultural}
                alt="Cultural performance"
                loading="lazy"
                className="aspect-square w-full rounded-2xl sm:rounded-3xl object-cover shadow-elevated"
              />
              <img
                src={studentLife}
                alt="Students collaborating"
                loading="lazy"
                className="aspect-square w-full rounded-2xl sm:rounded-3xl object-cover shadow-elevated"
              />
            </div>
            <div className="absolute -bottom-3 -left-3 flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-hero-gradient text-ivory shadow-elevated sm:-bottom-4 sm:-left-4 sm:h-28 sm:w-28">
              <span className="font-display text-2xl sm:text-3xl leading-none">25+</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest mt-1">Years</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:rounded-3xl sm:p-10">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Our Mission</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
                {mission}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-ink-gradient p-5 text-ivory sm:rounded-3xl sm:p-10">
              <h2 className="font-display text-2xl sm:text-3xl">Our Vision</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/80 sm:mt-4 sm:text-base">
                {vision}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 sm:mt-8">
                {values.map((v) => (
                  <span
                    key={v}
                    className="rounded-full border border-gold/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-gold sm:px-4 sm:text-xs sm:tracking-[0.2em]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-page py-10 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:tracking-[0.25em]">
            Our Journey
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">
            Twenty-five years of quietly raising the bar.
          </h2>
        </div>
        <div className="relative mt-10 sm:mt-14">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border/60" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/70 to-gold"
          />
          <div className="space-y-10 sm:space-y-12">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className={`relative grid sm:grid-cols-2 gap-6 sm:gap-12 ${
                  i % 2 === 0 ? "" : "sm:[&>*:first-child]:order-2"
                }`}
              >
                <div className={`pl-10 sm:pl-0 ${i % 2 === 0 ? "sm:text-right sm:pr-12" : "sm:pl-12"}`}>
                  <div className="font-display text-3xl text-gradient-hero sm:text-4xl">{t.year}</div>
                  <h3 className="mt-2 font-display text-xl text-ink sm:text-2xl">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
                </div>
                <div className="hidden sm:block" />
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute left-[8px] sm:left-1/2 sm:-translate-x-1/2 top-2 h-4 w-4 rounded-full bg-primary ring-4 ring-background"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Administration */}
      <section className="container-page overflow-hidden py-10 sm:py-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:tracking-[0.25em]"
        >
          Administration
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl"
        >
          Leading with vision, managing with integrity.
        </motion.h2>

        <div className="mt-8 grid items-stretch gap-5 sm:mt-12 sm:gap-8 lg:grid-cols-[1fr_1.4fr]">
          <motion.div
            initial={{ opacity: 0, x: -120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl bg-hero-gradient p-6 text-ivory sm:rounded-3xl sm:p-10"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-ivory/80 sm:tracking-[0.25em]">
              State Admn. Secretary
            </div>
            <h3 className="mt-4 font-display text-3xl sm:text-4xl">Mrs. B. Mithu</h3>
            <p className="mt-1 text-ivory/80">M.A, B.Ed</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 sm:rounded-3xl sm:p-10"
          >
            <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
              "{principalQuote}"
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base">
              {principalBio}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Faculty */}
      <section className="container-page py-10 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:tracking-[0.25em]">
            Our Educators
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">
            Meet our dedicated mentors.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            A team of qualified, caring, and experienced teachers shaping curious minds and guiding every student to reach their potential.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(dbFaculty.length > 0
            ? dbFaculty
            : [
                {
                  name: "Mr. K. Srinivasa Rao",
                  role: "Senior Mathematics Faculty",
                  qualification: "M.Sc., B.Ed",
                  dept: "Mathematics",
                  initials: "KS",
                },
                {
                  name: "Mrs. P. Anuradha",
                  role: "English Language Coordinator",
                  qualification: "M.A., B.Ed",
                  dept: "English",
                  initials: "PA",
                },
                {
                  name: "Mr. S. K. Murthy",
                  role: "Social Studies Department Head",
                  qualification: "M.A., B.Ed",
                  dept: "Social Sciences",
                  initials: "SM",
                },
                {
                  name: "Mrs. G. Lakshmi",
                  role: "Senior Telugu & Hindi Mentor",
                  qualification: "M.A., Sahitya Ratna",
                  dept: "Languages",
                  initials: "GL",
                },
                {
                  name: "Mrs. K. Madhavi",
                  role: "Physical & Natural Sciences Faculty",
                  qualification: "M.Sc., B.Ed",
                  dept: "Sciences",
                  initials: "KM",
                },
                {
                  name: "Mr. V. Raju",
                  role: "Physical Education Director",
                  qualification: "B.P.Ed",
                  dept: "Physical Education",
                  initials: "VR",
                },
              ]
          ).map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-elevated hover:-translate-y-1 transition duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-gold/10 text-xl font-bold font-display text-primary select-none group-hover:scale-105 transition-transform">
                  {f.initials}
                </div>
                <div>
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-primary">
                    {f.dept}
                  </span>
                  <h3 className="mt-1 font-display text-lg text-ink font-semibold">
                    {f.name}
                  </h3>
                </div>
              </div>
              <div className="mt-5 border-t border-border/60 pt-4">
                <p className="text-sm font-medium text-foreground/80">{f.role}</p>
                <p className="mt-1 text-xs text-muted-foreground">{f.qualification}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Facts */}
      <section className="container-page py-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:tracking-[0.25em]">
          Our Key Facts
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-5xl">
          A culture of consistency, focus and care.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Tap the arrows to navigate · auto-scrolls when idle.
        </p>
        <div className="mt-10">
          <HorizontalAutoScroll items={keyFacts} />
        </div>
      </section>
    </SiteShell>
  );
}
