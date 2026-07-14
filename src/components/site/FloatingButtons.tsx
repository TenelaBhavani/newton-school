import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { SCHOOL } from "@/lib/school";

export function FloatingButtons() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(document.documentElement.scrollTop > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-foreground text-background shadow-elevated hover:scale-105 transition"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a
        href={`https://wa.me/${SCHOOL.phoneRaw}?text=${encodeURIComponent(
          "Hello Newton English Medium School, I would like to know more about admissions.",
        )}`}
        target="_blank"
        rel="noreferrer"
        className="group relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-elevated animate-pulse-ring"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
