import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from "lucide-react";
import { NAV, SCHOOL } from "@/lib/school";

const logoUrl = "/newton-logo.png";

export function Footer() {
  return (
    <footer className="relative mt-16 sm:mt-24 lg:mt-32 overflow-hidden bg-ink-gradient text-ivory">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 20% 0%, oklch(0.55 0.21 25 / 0.4), transparent 60%), radial-gradient(500px circle at 90% 100%, oklch(0.82 0.16 85 / 0.25), transparent 60%)",
        }}
      />
      <div className="container-page relative py-10 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Newton EM School" className="h-20 w-auto object-contain drop-shadow-md" />
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ivory/70 max-w-sm">
              Since {SCHOOL.established}, nurturing curious minds with discipline,
              creativity and care — preparing tomorrow's leaders today.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-primary hover:border-primary transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-ivory/75">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-gold transition">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold">
              Admissions
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-ivory/75">
              <li>Pre-Primary</li>
              <li>Primary (I–V)</li>
              <li>Upper Primary (VI–VIII)</li>
              <li>High School (IX–X)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold">
              Reach Us
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-ivory/80">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span>{SCHOOL.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <a href={`tel:${SCHOOL.phoneRaw}`}>{SCHOOL.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <a href={`mailto:${SCHOOL.email}`}>{SCHOOL.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ivory/50">
          <p>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
          <p>Education is Light of Life — Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}
