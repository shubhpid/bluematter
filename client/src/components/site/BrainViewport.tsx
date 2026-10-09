import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AsciiBrain from "./AsciiBrain";
import { Eyebrow, Reveal, SplitWords } from "./motion";

const bands = [
  { name: "Delta", range: "0.5–4 Hz", base: 0.42 },
  { name: "Theta", range: "4–8 Hz", base: 0.55 },
  { name: "Alpha", range: "8–12 Hz", base: 0.78 },
  { name: "Beta", range: "12–30 Hz", base: 0.48 },
  { name: "Gamma", range: "30+ Hz", base: 0.3 },
];

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

function Corner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute size-4 border-signal ${className}`} />;
}

export default function BrainViewport() {
  const values = useLiveBands();

  return (
    <section aria-labelledby="viewport-title" className="relative overflow-hidden py-24 md:py-32">
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Reveal>
            <Eyebrow>Signal viewport</Eyebrow>
          </Reveal>
          <h2 id="viewport-title" className="type-h2 text-balance text-4xl text-paper md:text-5xl">
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
          <div className="relative aspect-square w-full rounded-lg border border-ink-line bg-ink-raised/60 sm:aspect-[5/4]">
            <Corner className="left-3 top-3 border-l border-t" />
            <Corner className="right-3 top-3 border-r border-t" />
            <Corner className="bottom-3 left-3 border-b border-l" />
            <Corner className="bottom-3 right-3 border-b border-r" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-8 pt-6 text-[11px] font-semibold uppercase tracking-widest text-slate">
              <span>Cortex / 3D</span>
              <span className="hidden sm:inline">Hover to steer</span>
            </div>
            <AsciiBrain className="absolute inset-6 top-12 bottom-12 cursor-grab text-[7px] leading-[7px] md:text-[8px] md:leading-[8px]" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-8 pb-5 text-[11px] font-semibold uppercase tracking-widest text-slate">
              <span className="flex items-center gap-2 text-signal">
                <span className="size-1.5 rounded-full bg-signal" />
                Streaming
              </span>
              <span className="tabular-nums">256 Hz</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
