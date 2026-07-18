import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingButtons } from "./FloatingButtons";

export function SiteShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden max-w-full">
      <Header />
      <main className={`flex-1 w-full max-w-full overflow-x-hidden ${isAdmin ? "pt-20 sm:pt-24" : "pt-0"}`}>
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
