import { motion, useScroll, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { useRef } from "react";
import assemblyTesting from "../assets/assembly-testing.jpg";
import prototypeRefinement from "../assets/prototype-refinement.png";
import researchDesign from "../assets/research-design.png";
import { Reveal, SplitWords } from "./motion";

type Status = "complete" | "current" | "upcoming";

const phases: { title: string; status: Status; items: string[]; image?: string; alt?: string }[] = [
  {
    title: "Research & design",
    status: "complete",
    items: ["Background research", "Electrical & mechanical design", "BOM finalization", "Software kickoff"],
    image: researchDesign,
    alt: "PCB design render for the BlueMatter prototype",
  },
  {
    title: "Assembly & testing",
    status: "complete",
    items: ["Battery & charging assembly", "Electrode fabrication", "Circuitry integration", "Data collection"],
    image: assemblyTesting,
    alt: "BlueMatter team assembling and testing prototype hardware",
  },
  {
    title: "Prototype refinement",
    status: "current",
    items: ["System testing", "AI data acquisition", "Head-fitting mesh", "Comfortable electrodes"],
    image: prototypeRefinement,
    alt: "Refined cap-based BlueMatter prototype with integrated wiring",
  },
  {
    title: "Software & application",
    status: "upcoming",
    items: ["Signal processing refinement", "AI model implementation", "User-friendly app", "Robotic arm control"],
  },
  {
    title: "Next generation",
    status: "upcoming",
    items: ["Higher electrode count", "Discreet form factor", "Dynamical systems", "Consumer-ready prototype"],
  },
];

const statusLabel: Record<Status, string> = { complete: "Complete", current: "In progress", upcoming: "Upcoming" };

export default function RoadmapSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="px-2 md:px-6">
      <div className="rounded-lg bg-paper py-24 text-paper-ink md:py-32">
        <div className="container flex flex-col gap-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div className="flex flex-col gap-6">
              <h2 id="roadmap-title" className="type-h2 text-balance text-4xl md:text-6xl">
                <SplitWords text="Building the future, one phase at a time." />
              </h2>
            </div>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-2 rounded-lg border border-signal/30 bg-signal-wash p-6">
                <span className="text-sm font-semibold text-signal-deep">Current status</span>
                <p className="text-pretty leading-relaxed text-paper-ink">
                  Our device uses 4 electrodes to read eye motion and blinking. Those signals are processed and used
                  to control a simple robot &mdash; a new modality of human-machine interaction.
                </p>
              </div>
            </Reveal>
          </div>

          <ol ref={listRef} className="relative flex flex-col">
            <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-paper-line" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: lineScale }}
              className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-signal"
            />
            {phases.map((p, i) => (
              <Reveal as="li" key={p.title} className="relative grid gap-6 py-8 pl-12 md:grid-cols-[1fr_1fr] md:gap-10">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-9 flex size-6 items-center justify-center rounded-full border ${
                    p.status === "complete"
                      ? "border-signal bg-signal text-paper"
                      : p.status === "current"
                        ? "border-signal bg-paper"
                        : "border-paper-line bg-paper"
                  }`}
                >
                  {p.status === "complete" && <Check className="size-3.5" strokeWidth={3} />}
                  {p.status === "current" && <span className="size-2 rounded-full bg-signal" />}
                </span>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-slate">Phase {i + 1}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === "current"
                          ? "bg-signal text-paper"
                          : p.status === "complete"
                            ? "bg-signal-wash text-signal-deep"
                            : "bg-paper-line/60 text-slate"
                      }`}
                    >
                      {statusLabel[p.status]}
                    </span>
                  </div>
                  <h3 className="type-h3 text-2xl md:text-3xl">{p.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {p.items.map((item) => (
                      <li key={item} className="rounded-md border border-paper-line px-3 py-1.5 text-sm text-slate">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {p.image && (
                  <div className="overflow-hidden rounded-lg border border-paper-line bg-paper-line/30">
                    <img
                      src={p.image}
                      alt={p.alt}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
