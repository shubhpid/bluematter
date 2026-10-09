import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";
import { Reveal, SplitWords } from "./motion";

const words = [
  { text: "intent", className: "left-[6%] top-[14%]", delay: "0s" },
  { text: "alpha 10 Hz", className: "right-[8%] top-[10%]", delay: "-2s" },
  { text: "blink", className: "left-[14%] bottom-[18%]", delay: "-4s" },
  { text: "focus", className: "right-[12%] bottom-[22%]", delay: "-1s" },
  { text: "motion", className: "left-[38%] top-[6%] hidden md:block", delay: "-3s" },
  { text: "control", className: "right-[34%] bottom-[8%] hidden md:block", delay: "-5s" },
  { text: "signal", className: "left-[3%] top-[48%] hidden lg:block", delay: "-2.5s" },
  { text: "spike", className: "right-[3%] top-[46%] hidden lg:block", delay: "-1.5s" },
];

const footerLinks = [
  { label: "Technology", href: "#technology" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Market", href: "#market" },
  { label: "Applications", href: "#applications" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Team", href: "#team" },
];

export default function ContactFooter() {
  return (
    <>
      <section id="contact" aria-labelledby="contact-title" className="px-2 md:px-6">
        <div className="grid-lines-dark relative overflow-hidden rounded-lg border border-ink-line bg-ink-raised py-28 md:py-40">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {words.map((w) => (
              <span
                key={w.text}
                className={`absolute text-lg font-semibold text-slate/50 md:text-xl ${w.className}`}
                style={{ animation: "drift 7s ease-in-out infinite", animationDelay: w.delay }}
              >
                {w.text}
              </span>
            ))}
          </div>
          <div className="container relative flex flex-col items-center gap-8 text-center">
            <img src="/brand/bluematter-mark.png" alt="" className="size-16" />
            <h2 id="contact-title" className="type-h1 max-w-4xl text-balance text-5xl text-paper md:text-7xl">
              <SplitWords text="Interested in the future of BCI?" />
            </h2>
            <Reveal delay={0.1}>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-slate-light">
                Researchers, investors, partners, or simply curious &mdash; we&apos;d love to connect. Follow our
                journey and reach out to learn more.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://www.linkedin.com/company/the-bluematter-project/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-signal px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                <Linkedin className="size-4" />
                Connect on LinkedIn
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://www.instagram.com/bluematterproject"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-line px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:border-paper"
              >
                <Instagram className="size-4" />
                Follow on Instagram
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="container flex flex-col gap-10 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex max-w-xs flex-col gap-4">
            <img src="/brand/bluematter-wordmark.png" alt="BlueMatter" className="h-9 w-fit" />
            <p className="text-sm leading-relaxed text-slate-light">
              Pioneering practical, non-invasive brain-computer interfaces for consumer applications.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm font-semibold text-slate-light transition-colors hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-ink-line pt-6 text-sm text-slate sm:flex-row">
          <p>&copy; {new Date().getFullYear()} The BlueMatter Project &middot; ASU Luminosity Lab</p>
          <p>NEXUS Summit 2026 &middot; Health Track</p>
        </div>
      </footer>
    </>
  );
}
