import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { HeroBackground } from "@/components/site/HeroBackground";
import classroom from "@/assets/hero-classroom.jpg";
import studentLife from "@/assets/student-life.jpg";
import cultural from "@/assets/cultural.jpg";
import lab from "@/assets/computer-lab.jpg";
import { SCHOOL } from "@/lib/school";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Admissions | Newton English Medium School" },
      {
        name: "description",
        content:
          "Reach Newton EM School in Kancharapalem, Visakhapatnam. Send an admission enquiry — we'll respond on WhatsApp.",
      },
      { property: "og:title", content: "Contact Newton EM School" },
      {
        property: "og:description",
        content: "Address, phone, email and admission enquiry form.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    student: "",
    klass: "",
    message: "",
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const msg = `Hello Newton English Medium School,

I would like to inquire about admission.

Parent Name: ${form.name}
Student Name: ${form.student}
Class Interested: ${form.klass}
Mobile Number: ${form.phone}
Message: ${form.message}

Please contact me regarding admission details.

Thank you.`;
    window.open(
      `https://wa.me/${SCHOOL.phoneRaw}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <SiteShell>
      <HeroBackground images={[classroom, studentLife, cultural, lab]} minHeight="min-h-[52vh]">
        <div className="container-page relative z-10 flex min-h-[52vh] flex-col justify-center py-12 text-ivory">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Contact & Admissions
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl lg:text-7xl max-w-3xl leading-tight">
            Let's start your child's <span className="text-gradient-gold">Newton journey.</span>
          </h1>
        </div>
      </HeroBackground>

      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Info */}
          <div className="space-y-4 sm:space-y-6">
            {[
              { Icon: MapPin, label: "Address", value: SCHOOL.address },
              { Icon: Phone, label: "Phone", value: SCHOOL.phone, href: `tel:${SCHOOL.phoneRaw}` },
              { Icon: Mail, label: "Email", value: SCHOOL.email, href: `mailto:${SCHOOL.email}` },
            ].map(({ Icon, label, value, href }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 flex gap-3 sm:gap-4"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {label}
                  </p>
                  {href ? (
                    <a href={href} className="mt-1 block text-foreground hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-foreground">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border h-56 sm:h-72">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Kancharapalem+Visakhapatnam&output=embed"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-8 md:p-10 shadow-elevated"
          >
            <h2 className="font-display text-2xl sm:text-3xl text-ink">Admission Enquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in your details — submit opens WhatsApp with your message ready
              to send.
            </p>

            <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2">
              <Field label="Parent Name" required value={form.name} onChange={set("name")} />
              <Field
                label="Mobile Number"
                required
                type="tel"
                inputMode="tel"
                pattern="[0-9+ ]{8,}"
                value={form.phone}
                onChange={set("phone")}
              />
              <Field label="Student Name" required value={form.student} onChange={set("student")} />
              <div>
                <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Class Interested *
                </label>
                <select
                  required
                  value={form.klass}
                  onChange={set("klass")}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a class</option>
                  {["Pre-KG", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"].map(
                    (c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Anything you'd like to share with us"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group mt-6 sm:mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 transition"
            >
              <MessageCircle className="h-4 w-4" />
              Send via WhatsApp
              <Send className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </motion.form>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {props.required ? " *" : ""}
      </label>
      <input
        {...props}
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
