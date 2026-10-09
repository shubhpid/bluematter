import { Accessibility, BrainCog, Gamepad2, HandMetal, HeartPulse, Home, type LucideIcon } from "lucide-react";
import type { PointerEvent } from "react";
import { Eyebrow, Reveal, SplitWords } from "./motion";

type UseCase = { icon: LucideIcon; title: string; desc: string; wide?: boolean };

const useCases: UseCase[] = [
  {
    icon: Accessibility,
    title: "Prosthetic control",
    desc: "Precise, intuitive control of prosthetic limbs through thought-based commands — restoring independence and mobility.",
    wide: true,
  },
  {
    icon: HeartPulse,
    title: "Mental health monitoring",
    desc: "Continuous, non-invasive monitoring of neurological patterns to catch early signs of anxiety and depression.",
  },
  {
    icon: Home,
    title: "Smart home control",
    desc: "Hands-free control of lights, thermostats, and entertainment through discreet neural commands.",
  },
  {
    icon: Gamepad2,
    title: "Immersive gaming",
    desc: "Gameplay your thoughts directly influence — a new dimension of player immersion.",
  },
  {
    icon: BrainCog,
    title: "Cognitive enhancement",
    desc: "Real-time neurofeedback for focus training, meditation guidance, and performance.",
  },
  {
    icon: HandMetal,
    title: "Robotic teleoperation",
    desc: "Remote control of robotic systems for hazardous environments, surgical assistance, and industry — directed by thought.",
    wide: true,
  },
];

function spotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function ApplicationsSection() {
  return (
    <section id="applications" aria-labelledby="applications-title" className="py-24 md:py-32">
      <div className="container flex flex-col gap-14">
        <div className="flex max-w-3xl flex-col gap-6">
          <Reveal>
            <Eyebrow>Applications</Eyebrow>
          </Reveal>
          <h2 id="applications-title" className="type-h2 text-balance text-4xl text-paper md:text-6xl">
            <SplitWords text="One interface. Endless possibilities." />
          </h2>
          <Reveal delay={0.1}>
            <p className="text-pretty text-lg leading-relaxed text-slate-light">
              From healthcare to entertainment, BlueMatter opens new frontiers in human-machine interaction.
            </p>
          </Reveal>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u, i) => (
            <Reveal as="li" key={u.title} delay={(i % 3) * 0.08} className={u.wide ? "lg:col-span-2" : ""}>
              <article
                onPointerMove={spotlight}
                className="group relative flex h-full min-h-64 flex-col justify-between gap-10 overflow-hidden rounded-lg border border-ink-line bg-ink-raised p-7 transition-colors duration-500 hover:border-signal/50"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--mx) var(--my), rgb(0 163 255 / 0.14), transparent 60%)",
                  }}
                />
                <span className="relative flex size-11 items-center justify-center rounded-md border border-ink-line bg-ink text-signal">
                  <u.icon className="size-5" />
                </span>
                <div className="relative flex flex-col gap-3">
                  <h3 className="type-h3 text-xl text-paper">{u.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-slate-light">{u.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
