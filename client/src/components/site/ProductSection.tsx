import { motion, useInView } from "framer-motion";
import { Battery, Bluetooth, BrainCircuit, CircuitBoard, Cpu, Smartphone, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import handImage from "../assets/Hand.png";
import { EASE, Reveal, SplitWords } from "./motion";
import NeuralField from "./NeuralField";

type Feature = { icon: LucideIcon; title: string; desc: string; stat: string };

const features: Feature[] = [
  {
    icon: Cpu,
    title: "High electrode count",
    desc: "20+ electrodes with full head coverage — far more than most commercial BCIs (4–8), comparable to clinical EEGs in scope of signal acquisition.",
    stat: "20+ channels",
  },
  {
    icon: Bluetooth,
    title: "Wireless connectivity",
    desc: "Completely wireless operation over Bluetooth on battery power — unlike clinical BCIs that need direct wiring for power and signal transmission.",
    stat: "Zero cables",
  },
  {
    icon: BrainCircuit,
    title: "Novel signal processing",
    desc: "A self-organizing brain map and spiking graph neural network classify brain signals as intended actions.",
    stat: "AI-enhanced",
  },
  {
    icon: CircuitBoard,
    title: "Custom electronics",
    desc: "Modular PCB and amplification circuitry, easy to replace and repair, compact enough to fit beneath a standard cap brim.",
    stat: "Modular PCB",
  },
  {
    icon: Battery,
    title: "Rechargeable design",
    desc: "Integrated charging circuit designed for all-day wear with rechargeable button-cell LiPo or smartwatch batteries.",
    stat: "All-day wear",
  },
  {
    icon: Smartphone,
    title: "App integration",
    desc: "Mobile and desktop apps for customization and seamless control over device connections and signal interpretation.",
    stat: "iOS · Android · Desktop",
  },
];

function FeatureRow({ feature, index, onActive }: { feature: Feature; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="flex min-h-[48vh] flex-col justify-center lg:min-h-[60vh]">
      <motion.div
        animate={{ opacity: inView ? 1 : 0.28 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col gap-4"
      >
        <span className="flex size-11 items-center justify-center rounded-md border border-ink-line bg-ink-raised text-signal">
          <feature.icon className="size-5" />
        </span>
        <h3 className="type-h3 text-2xl text-paper md:text-3xl">{feature.title}</h3>
        <p className="max-w-md leading-relaxed text-slate-light">{feature.desc}</p>
        <span className="text-sm font-semibold text-signal">{feature.stat}</span>
      </motion.div>
    </li>
  );
}

export default function ProductSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="technology" aria-labelledby="product-title" className="relative overflow-clip py-24 md:py-32">
      <NeuralField className="absolute inset-0 h-full w-full opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]" />
      <div className="container relative">
        <div className="flex max-w-3xl flex-col gap-6">
          <h2 id="product-title" className="type-h2 text-balance text-4xl text-paper md:text-6xl">
            <SplitWords text="Everyday technology. Extraordinary control." />
          </h2>
          <Reveal delay={0.1}>
            <p className="text-pretty text-lg leading-relaxed text-slate-light">
              Discreet design, wireless connectivity, refined software, and custom circuitry &mdash; engineered
              together so the most advanced part of your day is the cap on your head.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-4 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
            <div className="relative w-full overflow-hidden rounded-lg border border-ink-line bg-ink-raised">
              <img
                src={handImage}
                alt="Illustration of a robotic hand holding a glowing neural network brain"
                className="aspect-[5/4] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 border-t border-ink-line bg-ink/80 p-4 backdrop-blur-md">
                <span className="text-sm font-semibold tabular-nums text-signal">
                  {String(active + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
                </span>
                <div className="flex flex-1 gap-1.5" aria-hidden="true">
                  {features.map((f, i) => (
                    <span key={f.title} className="h-0.5 flex-1 overflow-hidden rounded-full bg-ink-line">
                      <motion.span
                        className="block h-full bg-signal"
                        animate={{ width: i <= active ? "100%" : "0%" }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </span>
                  ))}
                </div>
                <span className="hidden text-sm font-semibold text-paper sm:block">{features[active].title}</span>
              </div>
            </div>
          </div>

          <ol className="flex flex-col">
            {features.map((f, i) => (
              <FeatureRow key={f.title} feature={f} index={i} onActive={setActive} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
