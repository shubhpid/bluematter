import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import erik from "../assets/erik-headshot.png";
import lucca from "../assets/lucca-headshot.jpg";
import saee from "../assets/saee-headshot.jpg";
import taylor from "../assets/taylor-foster-headshot.png";
import tyler from "../assets/tyler-headshot.png";
import { Eyebrow, Reveal, SplitWords } from "./motion";

const team = [
  {
    name: "Erik O'Bryant",
    role: "Project & Software Development Lead",
    dept: "Biomedical Engineering",
    photo: erik,
    focus: "Project direction, system design, and signal processing architecture",
  },
  {
    name: "Tyler Santos",
    role: "Electrical Systems Lead",
    dept: "Electrical Engineering",
    photo: tyler,
    focus: "Custom PCB design, amplification circuitry, and power management",
  },
  {
    name: "Lucca Saraceno",
    role: "Mechanical Systems & Fabrication Lead",
    dept: "Biomedical Engineering",
    photo: lucca,
    focus: "Software development, data collection, and mechanical integration",
  },
  {
    name: "Taylor Foster",
    role: "Human Systems & Algorithms Research Lead",
    dept: "Human Systems Engineering",
    photo: taylor,
    focus: "Machine learning research, market analysis, and documentation",
  },
  {
    name: "Saee Pangarkar",
    role: "Technical Research & Implementation Lead",
    dept: "Biomedical Engineering",
    photo: saee,
    focus: "AI model development, electrode research, and preprocessing",
  },
];

export default function TeamSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 30 });
  const y = useSpring(my, { stiffness: 250, damping: 30 });

  const onMove = (e: PointerEvent) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section id="team" aria-labelledby="team-title" className="py-24 md:py-32">
      <div className="container flex flex-col gap-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="flex flex-col gap-6">
            <Reveal>
              <Eyebrow>The team</Eyebrow>
            </Reveal>
            <h2 id="team-title" className="type-h2 text-balance text-4xl text-paper md:text-6xl">
              <SplitWords text="The minds behind it." />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-slate-light">
              A multidisciplinary team of Arizona State University engineers working across electrical, biomedical,
              and human systems engineering through The Luminosity Lab.
            </p>
          </Reveal>
        </div>

        <ul
          ref={listRef}
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(null)}
          className="relative border-t border-ink-line"
        >
          <AnimatePresence>
            {hovered !== null && (
              <motion.img
                key="portrait"
                src={team[hovered].photo}
                alt=""
                aria-hidden="true"
                style={{ x, y, translateX: "-50%", translateY: "-50%" }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute left-0 top-0 z-10 hidden h-56 w-44 rounded-lg object-cover shadow-2xl lg:block"
              />
            )}
          </AnimatePresence>
          {team.map((m, i) => (
            <Reveal
              as="li"
              key={m.name}
              delay={i * 0.05}
              className="border-b border-ink-line"
            >
              <div
                onPointerEnter={() => setHovered(i)}
                className={`grid items-center gap-4 py-6 transition-opacity duration-300 md:grid-cols-[auto_1.2fr_1fr_auto] md:gap-8 md:py-8 ${
                  hovered !== null && hovered !== i ? "lg:opacity-35" : ""
                }`}
              >
                <img src={m.photo} alt={m.name} className="size-14 rounded-md object-cover lg:hidden" />
                <h3 className="type-h3 hidden text-3xl text-paper lg:block lg:text-4xl">{m.name}</h3>
                <div className="flex flex-col gap-1">
                  <span className="type-h3 text-2xl text-paper lg:hidden">{m.name}</span>
                  <span className="font-semibold text-signal">{m.role}</span>
                  <span className="text-sm leading-relaxed text-slate-light">{m.focus}</span>
                </div>
                <span className="text-sm font-semibold text-slate md:text-right">{m.dept}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
