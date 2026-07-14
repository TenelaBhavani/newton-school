import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingButtons } from "./FloatingButtons";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden max-w-full">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24 w-full max-w-full overflow-x-hidden">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
