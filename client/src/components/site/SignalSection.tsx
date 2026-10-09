import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import EegTrace from "./EegTrace";
import { Reveal, SplitWords } from "./motion";

const bands = [
  { name: "Delta", range: "0.5–4 Hz", base: 0.42 },
  { name: "Theta", range: "4–8 Hz", base: 0.55 },
  { name: "Alpha", range: "8–12 Hz", base: 0.78 },
  { name: "Beta", range: "12–30 Hz", base: 0.48 },
  { name: "Gamma", range: "30+ Hz", base: 0.3 },
];

const channels = ["Fp1", "Fp2", "C3", "C4", "P3", "P4", "O1", "O2"];

function useLiveBands() {
  const [values, setValues] = useState(() => bands.map((b) => b.base));
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setValues(bands.map((b) => Math.max(0.08, Math.min(1, b.base + (Math.random() - 0.5) * 0.3))));
    }, 900);
    return () => clearInterval(id);
  }, []);
  return values;
}

export default function SignalSection() {
  const values = useLiveBands();

  return (
    <section aria-labelledby="signal-title" className="relative overflow-hidden pb-24 md:pb-32">
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 id="signal-title" className="type-h2 text-balance text-4xl text-paper md:text-5xl">
            <SplitWords text="Raw neural activity, decoded into intent." />
          </h2>
          <Reveal delay={0.1}>
            <p className="max-w-md text-pretty leading-relaxed text-slate-light">
              Every electrode streams continuously. Our pipeline separates frequency bands in real time, cleans
              motion artifacts, and maps the result onto a model of your brain.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-2 flex flex-col gap-3">
              {bands.map((b, i) => (
                <div key={b.name} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-4">
                  <dt className="flex flex-col">
                    <span className="text-sm font-semibold text-paper">{b.name}</span>
                    <span className="text-xs text-slate">{b.range}</span>
                  </dt>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-line/60">
                    <motion.div
                      className="h-full rounded-full bg-signal"
                      animate={{ width: `${values[i] * 100}%` }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                    />
                  </div>
                  <dd className="text-right text-sm font-semibold tabular-nums text-slate-light">
                    {Math.round(values[i] * 100)}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={40}>
          <div className="flex flex-col overflow-hidden rounded-lg border border-ink-line bg-ink-raised/60">
            <div className="flex items-center justify-between border-b border-ink-line px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate">
              <span className="flex items-center gap-2 text-signal">
                <span className="size-1.5 rounded-full bg-signal" />
                Live EEG
              </span>
            </div>
            <div className="flex gap-4 px-6 py-6">
              <ul className="flex flex-col justify-around text-xs font-semibold tabular-nums text-slate" aria-label="Electrode positions">
                {channels.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <EegTrace channels={8} className="h-80 w-full md:h-96" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
