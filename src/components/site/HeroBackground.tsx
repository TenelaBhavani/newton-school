import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  images: string[];
  intervalMs?: number;
  overlay?: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
};

export function HeroBackground({
  images,
  intervalMs = 4000,
  overlay = "linear-gradient(to bottom, rgba(15,15,25,0.55), rgba(15,15,25,0.75))",
  children,
  className = "",
  minHeight = "min-h-[80vh]",
}: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <section className={`relative isolate overflow-hidden ${minHeight} ${className}`}>
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="sync">
          <motion.img
            key={i}
            src={images[i]}
            alt=""
            aria-hidden
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: overlay }} />
      </div>
      {children}
    </section>
  );
}
