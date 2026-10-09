import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { EASE } from "./motion";

const links = [
  { label: "Technology", href: "#technology" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Market", href: "#market" },
  { label: "Applications", href: "#applications" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Team", href: "#team" },
];

export default function SiteNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (Math.abs(y - prev) < 2) return;
    setHidden(y > 40 && y > prev && !open);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div
        className={`transition-colors duration-500 ${
          scrolled || open ? "border-b border-ink-line/60 bg-ink/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="container flex h-20 items-center justify-between gap-6">
          <a href="#top" className="flex shrink-0 items-center" aria-label="BlueMatter home">
            <img src="/brand/bluematter-wordmark.png" alt="BlueMatter" className="h-8 w-auto md:h-9" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-light transition-colors hover:bg-ink-raised hover:text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden rounded-md bg-paper px-4 py-2.5 text-sm font-semibold text-paper-ink transition-colors hover:bg-signal sm:inline-flex"
            >
              Get in touch
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex size-10 items-center justify-center rounded-md border border-ink-line text-paper lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="container flex flex-col overflow-hidden lg:hidden"
            >
              {[...links, { label: "Get in touch", href: "#contact" }].map((l) => (
                <li key={l.href} className="border-t border-ink-line/60">
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-lg font-semibold text-paper"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
