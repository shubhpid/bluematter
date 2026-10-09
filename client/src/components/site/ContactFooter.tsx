import { ArrowUpRight, Instagram, Linkedin, Mail } from "lucide-react";
import { Reveal, SplitWords } from "./motion";

// TODO: replace with the team's real inbox
const CONTACT_EMAIL = "hello@bluematterproject.com";

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

const socials = [
  { label: "LinkedIn", handle: "The BlueMatter Project", href: "https://www.linkedin.com/company/the-bluematter-project/", icon: Linkedin },
  { label: "Instagram", handle: "@bluematterproject", href: "https://www.instagram.com/bluematterproject", icon: Instagram },
  { label: "Email", handle: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
];

export default function ContactFooter() {
  return (
    <div data-page className="flex h-[100svh] min-h-[560px] flex-col px-2 pt-2 md:px-6 md:pt-6">
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="grid-lines-dark relative flex min-h-0 flex-1 flex-col justify-center overflow-hidden rounded-lg border border-ink-line bg-ink-raised py-8"
      >
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
        <div className="container relative flex flex-col items-center gap-4 text-center [@media(min-height:760px)]:gap-6">
          <img src="/brand/bluematter-mark.png" alt="" className="hidden size-12 [@media(min-height:760px)]:block" />
          <h2
            id="contact-title"
            className="type-h1 max-w-4xl text-balance text-4xl text-paper md:text-5xl [@media(min-height:760px)]:md:text-6xl"
          >
            <SplitWords text="Interested in the future of BCI?" />
          </h2>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-light md:text-lg">
              Researchers, investors, partners, or simply curious &mdash; we&apos;d love to connect.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-signal px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-paper"
            >
              Get in touch
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="container flex shrink-0 flex-col gap-5 py-6">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_auto_1.6fr] lg:items-start">
          <div className="flex max-w-xs flex-col gap-3">
            <img src="/brand/bluematter-wordmark.png" alt="BlueMatter" className="h-8 w-fit" />
            <p className="hidden text-sm leading-relaxed text-slate-light [@media(min-height:760px)]:md:block">
              Pioneering practical, non-invasive brain-computer interfaces for consumer applications.
            </p>
          </div>

          <nav aria-label="Footer" className="hidden flex-col gap-3 md:flex">
            <h3 className="type-eyebrow text-slate">Explore</h3>
            <ul className="grid grid-cols-3 gap-x-6 gap-y-2">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm font-semibold text-slate-light transition-colors hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
            <h3 className="type-eyebrow text-slate">Reach out</h3>
            <ul className="grid gap-2 sm:grid-cols-3">
              {socials.map((s) => (
                <li key={s.label} className="min-w-0">
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3 rounded-md border border-ink-line px-3 py-2.5 transition-colors hover:border-signal/60 hover:bg-ink-raised"
                  >
                    <s.icon className="size-4 shrink-0 text-signal" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-semibold text-paper">{s.label}</span>
                      <span className="truncate text-xs text-slate-light">{s.handle}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-slate transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-ink-line pt-4 text-xs text-slate sm:flex-row">
          <p>&copy; {new Date().getFullYear()} The BlueMatter Project &middot; ASU Luminosity Lab</p>
          <p>NEXUS Summit 2026 &middot; Health Track</p>
        </div>
      </footer>
    </div>
  );
}
