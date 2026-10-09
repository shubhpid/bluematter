import { motion } from "framer-motion";
import { EASE, Eyebrow, Reveal, SplitWords } from "./motion";

const ends = [
  {
    side: "Clinical EEG",
    points: ["$10,000–$30,000", "64–256 electrodes", "Wired, bulky headsets", "Lab-only, often invasive"],
  },
  {
    side: "Consumer headbands",
    points: ["~$3,000", "4–8 electrodes", "Low–medium fidelity", "Limited real-world use"],
  },
];

export default function ProblemSection() {
  return (
    <section aria-labelledby="problem-title" className="py-24 md:py-32">
      <div className="container flex flex-col gap-14">
        <div className="flex max-w-3xl flex-col gap-6">
          <Reveal>
            <Eyebrow>The problem</Eyebrow>
          </Reveal>
          <h2 id="problem-title" className="type-h2 text-balance text-4xl text-paper md:text-6xl">
            <SplitWords text="Today's BCIs force a trade-off." />
          </h2>
          <Reveal delay={0.1}>
            <p className="text-pretty text-lg leading-relaxed text-slate-light">
              Clinical systems deliver high-fidelity signal but are expensive, wired, and confined to the lab.
              Consumer devices are affordable but sacrifice the electrode coverage needed for meaningful control.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="relative rounded-lg border border-ink-line bg-ink-raised/50 p-6 md:p-10">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-slate">
              <span>High fidelity</span>
              <span>Low cost</span>
            </div>

            <div className="relative my-10 h-px bg-ink-line">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-signal-deep via-signal to-signal-deep"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 1.6, ease: EASE }}
              />
              <span className="absolute -top-1 left-0 size-2 rounded-full bg-slate" />
              <span className="absolute -top-1 right-0 size-2 rounded-full bg-slate" />
              <motion.div
                className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                initial={{ left: "0%", opacity: 0 }}
                whileInView={{ left: "50%", opacity: 1 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
              >
                <span className="relative flex size-5 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full bg-signal/50"
                    style={{ animation: "pulse-ring 2.2s ease-out infinite" }}
                  />
                  <span className="size-3 rounded-full bg-signal ring-4 ring-ink" />
                </span>
                <span className="absolute top-7 whitespace-nowrap rounded-md bg-signal px-2.5 py-1 text-xs font-bold text-ink">
                  BlueMatter
                </span>
              </motion.div>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col gap-3">
                <h3 className="type-h3 text-lg text-paper">{ends[0].side}</h3>
                <ul className="flex flex-col gap-2 text-sm text-slate-light">
                  {ends[0].points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 rounded-md border border-signal/40 bg-signal/5 p-5 md:-my-5">
                <h3 className="type-h3 text-lg text-signal">The sweet spot</h3>
                <p className="text-sm leading-relaxed text-paper">
                  20+ electrodes, AI-enhanced fidelity, fully wireless, and a target cost near $400 &mdash; inside
                  something you already wear.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end md:text-right">
                <h3 className="type-h3 text-lg text-paper">{ends[1].side}</h3>
                <ul className="flex flex-col gap-2 text-sm text-slate-light">
                  {ends[1].points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
