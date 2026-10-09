import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EASE, Reveal } from "./motion";

type Device = {
  id: string;
  name: string;
  kind: string;
  channels: number;
  channelsLabel: string;
  price: string;
  /** 0 = wear anywhere, 1 = brain surgery */
  barrier: number;
  summary: string;
  notes: string[];
  ours?: boolean;
  /** Where the chart label sits relative to the dot, chosen so neighbours never collide. */
  label: "top" | "bottom" | "left" | "right";
};

const devices: Device[] = [
  {
    id: "bluematter",
    label: "top",
    name: "BlueMatter",
    kind: "Everyday wearable",
    channels: 20,
    channelsLabel: "20+",
    price: "Consumer-priced",
    barrier: 0.06,
    summary: "Electrodes hidden inside a baseball cap. Nothing to implant, nothing to glue, nothing that looks like a medical device.",
    notes: ["No surgery, no implant", "No gel or saline prep", "Wireless — wear it anywhere"],
    ours: true,
  },
  {
    id: "muse",
    label: "bottom",
    name: "Muse",
    kind: "Consumer headband",
    channels: 4,
    channelsLabel: "4",
    price: "~$250–$500",
    barrier: 0.12,
    summary: "A meditation headband with a handful of sensors on the forehead and behind the ears.",
    notes: ["Only 4 channels, frontal and temporal", "Built for meditation feedback, not control", "Too sparse for spatial brain mapping"],
  },
  {
    id: "emotiv",
    label: "bottom",
    name: "Emotiv EPOC X",
    kind: "Consumer headset",
    channels: 14,
    channelsLabel: "14",
    price: "~$1,000",
    barrier: 0.24,
    summary: "A 14-channel wireless headset that uses saline-soaked felt sensors.",
    notes: ["Saline sensors dry out mid-session", "Visible headset — not built for public wear", "Re-wetting and fitting before every use"],
  },
  {
    id: "openbci",
    label: "top",
    name: "OpenBCI",
    kind: "Research kit",
    channels: 16,
    channelsLabel: "8–16",
    price: "~$1,000–$3,000",
    barrier: 0.36,
    summary: "Open-source boards and a 3D-printed headset for DIY and academic research.",
    notes: ["Assembly and electrode tuning required", "Exposed hardware and a bulky frame", "Aimed at developers, not everyday users"],
  },
  {
    id: "clinical",
    label: "right",
    name: "Clinical EEG",
    kind: "Lab system",
    channels: 256,
    channelsLabel: "64–256",
    price: "$10,000–$30,000",
    barrier: 0.5,
    summary: "The gold standard for scalp recordings — in a hospital or research lab.",
    notes: ["Conductive gel and a trained technician", "Wired to a stationary amplifier", "Lab-only, long setup and cleanup"],
  },
  {
    id: "synchron",
    label: "top",
    name: "Synchron Stentrode",
    kind: "Endovascular implant",
    channels: 16,
    channelsLabel: "16",
    price: "Clinical trial",
    barrier: 0.74,
    summary: "A stent-mounted electrode array threaded through the jugular vein into a vessel beside the motor cortex.",
    notes: ["Catheter procedure inside brain blood vessels", "Clotting risk and long-term blood thinners", "Permanent implant, trial access only"],
  },
  {
    id: "neuralink",
    label: "left",
    name: "Neuralink N1",
    kind: "Surgical implant",
    channels: 1024,
    channelsLabel: "1,024",
    price: "Clinical trial",
    barrier: 0.94,
    summary: "A coin-sized implant whose 64 ultra-thin threads are inserted into the cortex by a surgical robot.",
    notes: ["Craniotomy — a piece of skull is removed", "Infection, bleeding and tissue-response risk", "Threads can retract; revision surgery is complex"],
  },
];

const CYCLE_MS = 5000;
const labelPos = {
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
} as const;
const yTicks = [4, 16, 64, 256, 1024];
const yPct = (ch: number) => ((Math.log2(ch) - 1) / 10) * 100;
const xPct = (barrier: number) => 4 + barrier * 92;

function Chart({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="relative h-[24rem] rounded-lg border border-ink-line bg-ink-raised/60 md:h-[30rem]">
      <div className="absolute bottom-14 left-14 right-6 top-8">
        {/* Implant zone */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 origin-right rounded-md border border-dashed border-ink-line bg-signal-deep/10"
          style={{ left: `${xPct(0.62)}%` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        >
          <span className="absolute bottom-3 right-3 text-[11px] font-semibold uppercase tracking-widest text-slate">
            Implant required
          </span>
        </motion.div>

        {/* Sweet spot */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 rounded-md border border-signal/40 bg-signal/5"
          style={{ width: `${xPct(0.16)}%`, bottom: `${yPct(10)}%`, top: `${100 - yPct(64)}%` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1, delay: 1.4, ease: EASE }}
        >
          <span className="absolute -top-6 left-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-signal">
            The empty corner
          </span>
        </motion.div>

        {yTicks.map((t, i) => (
          <div key={t} aria-hidden="true" className="absolute inset-x-0" style={{ bottom: `${yPct(t)}%` }}>
            <motion.div
              className="h-px origin-left bg-ink-line/70"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.1, delay: i * 0.08, ease: EASE }}
            />
            <span className="absolute -left-11 -translate-y-1/2 text-xs tabular-nums text-slate">{t}</span>
          </div>
        ))}

        {devices.map((d, i) => {
          const isActive = d.id === active;
          return (
            <div
              key={d.id}
              className="absolute -translate-x-1/2 translate-y-1/2"
              style={{ left: `${xPct(d.barrier)}%`, bottom: `${yPct(d.channels)}%` }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.6 + i * 0.1 }}
              >
                <motion.button
                  type="button"
                  onClick={() => onSelect(d.id)}
                  aria-label={`${d.name}: ${d.channelsLabel} channels, ${d.kind}`}
                  aria-pressed={isActive}
                  animate={reduce ? undefined : { y: [0, -5, 0] }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  className="group relative flex"
                >
                  <span className="relative flex size-4 items-center justify-center">
                    {(isActive || d.ours) && (
                      <span
                        className={`absolute inset-0 rounded-full ${d.ours ? "bg-signal" : "bg-slate-light"}`}
                        style={{ animation: "pulse-ring 2s ease-out infinite" }}
                      />
                    )}
                    <span
                      className={`relative rounded-full border-2 transition-all duration-300 ${
                        d.ours
                          ? "size-4 border-signal bg-signal"
                          : isActive
                            ? "size-3.5 border-paper bg-paper"
                            : "size-3 border-slate-light bg-ink group-hover:border-paper"
                      }`}
                    />
                  </span>
                  <span
                    className={`absolute whitespace-nowrap text-xs font-semibold transition-colors ${labelPos[d.label]} ${
                      d.ours ? "text-signal" : isActive ? "text-paper" : "text-slate group-hover:text-slate-light"
                    }`}
                  >
                    {d.name}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-14 right-6 flex flex-col gap-2 pb-4">
        <div className="h-px bg-gradient-to-r from-signal via-slate to-slate-light/40" />
        <div className="flex justify-between text-[11px] font-semibold uppercase tracking-widest text-slate">
          <span>Wear anywhere</span>
          <span className="hidden sm:inline">Barrier to use</span>
          <span>Brain surgery</span>
        </div>
      </div>
      <span className="absolute left-3 top-1/2 origin-center -translate-y-1/2 -rotate-90 text-[11px] font-semibold uppercase tracking-widest text-slate">
        Channels
      </span>
    </div>
  );
}

function Detail({ device }: { device: Device }) {
  return (
    <motion.div
      key={device.id}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <span className={`text-sm font-semibold ${device.ours ? "text-signal" : "text-slate-light"}`}>{device.kind}</span>
        <h3 className="type-h3 text-3xl text-paper">{device.name}</h3>
        <p className="text-pretty leading-relaxed text-slate-light">{device.summary}</p>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-y border-ink-line py-5">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-widest text-slate">Channels</dt>
          <dd className="text-2xl font-semibold tabular-nums text-paper">{device.channelsLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-widest text-slate">Price</dt>
          <dd className="text-2xl font-semibold text-paper">{device.price}</dd>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <dt className="text-xs font-semibold uppercase tracking-widest text-slate">Barrier to use</dt>
          <dd className="h-1.5 overflow-hidden rounded-full bg-ink-line/60">
            <motion.div
              className={`h-full rounded-full ${device.ours ? "bg-signal" : "bg-slate-light"}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(6, device.barrier * 100)}%` }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <span className="sr-only">{Math.round(device.barrier * 100)} out of 100</span>
          </dd>
        </div>
      </dl>

      <ul className="flex flex-col gap-3">
        {device.notes.map((n, i) => (
          <motion.li
            key={n}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: EASE }}
            className="flex items-start gap-3 text-sm leading-relaxed text-slate-light"
          >
            {device.ours ? (
              <Check className="mt-0.5 size-4 shrink-0 text-signal" />
            ) : (
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-slate" />
            )}
            {n}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function LandscapeSection() {
  const [active, setActive] = useState("bluematter");
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-20%" });
  const reduce = useReducedMotion();
  const cycling = inView && !paused && !reduce;

  useEffect(() => {
    if (!cycling) return;
    const id = setTimeout(() => {
      const idx = devices.findIndex((d) => d.id === active);
      setActive(devices[(idx + 1) % devices.length].id);
    }, CYCLE_MS);
    return () => clearTimeout(id);
  }, [active, cycling]);

  const select = (id: string) => {
    setPaused(true);
    setActive(id);
  };
  const device = devices.find((d) => d.id === active) ?? devices[0];

  return (
    <section ref={sectionRef} aria-labelledby="landscape-title" className="overflow-x-clip py-24 md:py-32">
      <div className="container flex flex-col gap-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <motion.h2
            id="landscape-title"
            initial={reduce ? false : { x: "-110vw", opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.3, ease: EASE }}
            className="type-h2 text-balance text-4xl text-paper md:text-6xl"
          >
            Every other path to your brain asks for something.
          </motion.h2>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-slate-light">
              Implants ask for surgery. Lab systems ask for gel, wires and a technician. Consumer headsets give up
              coverage. BlueMatter is built for the empty corner of the map.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          <div role="tablist" aria-label="Compare brain-computer interfaces" className="flex flex-wrap gap-2">
            {devices.map((d) => {
              const isActive = d.id === active;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => select(d.id)}
                  className={`relative overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive ? "border-transparent text-ink" : "border-ink-line text-slate-light hover:border-slate hover:text-paper"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="landscape-tab"
                      className={`absolute inset-0 rounded-full ${d.ours ? "bg-signal" : "bg-paper"}`}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {isActive && cycling && (
                    <motion.span
                      key={`${d.id}-progress`}
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ink/40"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                    />
                  )}
                  <span className="relative">{d.name}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Reveal y={40}>
              <Chart active={active} onSelect={select} />
            </Reveal>
            <Reveal delay={0.1} y={40}>
              <div
                role="tabpanel"
                aria-live="polite"
                className="flex h-full min-h-[30rem] flex-col justify-between gap-8 rounded-lg border border-ink-line bg-ink-raised p-6 md:p-8"
              >
                <AnimatePresence mode="wait">
                  <Detail device={device} />
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
          <p className="text-xs leading-relaxed text-slate">
            Channel counts and prices are approximate, drawn from public sources, and shown for comparison only.
          </p>
        </div>
      </div>
    </section>
  );
}
