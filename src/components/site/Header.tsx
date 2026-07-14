import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap } from "lucide-react";
import { NAV, SCHOOL } from "@/lib/school";

const logoUrl = "/newton-logo.png";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 sm:py-2" : "py-2 sm:py-2 lg:py-3"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
        <div className="flex min-h-14 items-center justify-between gap-2 rounded-2xl glass-card px-3 py-2 shadow-[0_10px_26px_-18px_rgba(15,15,25,0.28)] sm:gap-3 sm:px-4">
          <Link to="/" className="group flex min-w-0 flex-1 items-center sm:flex-none">
            <img
              src={logoUrl}
              alt="Newton English Medium School logo"
              className="h-10 w-auto max-w-[150px] shrink object-contain drop-shadow-sm transition-transform group-hover:scale-105 sm:h-12 sm:max-w-[180px] lg:h-14 lg:max-w-[220px]"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    active
                      ? "text-primary"
                      : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to="/contact"
              className="hidden md:inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 transition"
            >
              <GraduationCap className="h-4 w-4" />
              Enroll Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm md:hidden max-[360px]:h-9 max-[360px]:w-9 max-[360px]:justify-center max-[360px]:px-0"
              aria-label="Enroll"
            >
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span className="max-[360px]:sr-only">Enroll</span>
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/15 sm:h-10 sm:w-10 lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>


        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 rounded-2xl p-3 shadow-elevated glass-card lg:hidden"
            >
              <div className="flex flex-col">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/10"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className="mt-2 inline-flex justify-center items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Enroll Now at {SCHOOL.shortName}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
