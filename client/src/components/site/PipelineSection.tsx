import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { Eyebrow, Reveal, SplitWords } from "./motion";

const steps = [
  {
    title: "Signal acquisition",
    desc: "Raw EEG captured from 20+ electrodes across the scalp, alongside accelerometer data for motion tracking.",
  },
  {
    title: "Artifact removal",
    desc: "Accelerometer-enhanced motion artifact removal filters environmental noise out of the raw brain signals.",
  },
  {
    title: "Filter & normalize",
    desc: "Advanced filtering and normalization with eye-artifact detection produce clean, usable data.",
  },
  {
    title: "Brain mapping",
    desc: "A novel self-organizing map generates a spatial brain map using topographically inspired techniques.",
  },
  {
    title: "Neural classification",
    desc: "A custom spiking graph convolution neural network learns from the brain map to classify intended actions.",
  },
  {
    title: "Action output",
    desc: "Predicted intentions are sent over Bluetooth to control connected devices in real time.",
  },
];

function StepCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  return (
    <article className="flex h-full flex-col justify-between gap-10 rounded-lg border border-ink-line bg-ink-raised p-6 md:p-8">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-signal">Stage {index + 1}</span>
        <span className="h-px w-16 bg-ink-line" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="type-h3 text-2xl text-paper">{step.title}</h3>
        <p className="leading-relaxed text-slate-light">{step.desc}</p>
      </div>
    </article>
  );
}

export default function PipelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  const intro = (
    <div className="container flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-2xl flex-col gap-6">
        <Reveal>
          <Eyebrow>Signal processing</Eyebrow>
        </Reveal>
        <h2 id="pipeline-title" className="type-h2 text-balance text-4xl text-paper md:text-6xl">
          <SplitWords text="From raw signal to intent." />
        </h2>
      </div>
      <Reveal delay={0.1}>
        <p className="max-w-md text-pretty leading-relaxed text-slate-light">
          Proven signal-processing techniques combined in a never-before-seen way to pull high-quality data out of a
          chaotic, noisy environment &mdash; and classify it in real time.
        </p>
      </Reveal>
    </div>
  );

  return (
    <section id="pipeline" ref={sectionRef} aria-labelledby="pipeline-title" className="relative lg:h-[320vh]">
      {/* Desktop: vertical scroll drives a pinned horizontal track */}
      <div className="sticky top-0 hidden h-screen flex-col justify-center gap-12 overflow-hidden lg:flex">
        {intro}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5 pl-[max(2.5rem,calc((100vw-1232px)/2+2.5rem))]">
          {steps.map((s, i) => (
            <div key={s.title} className="h-80 w-[26rem]">
              <StepCard step={s} index={i} />
            </div>
          ))}
        </motion.div>
        <div className="container">
          <div className="h-px w-full bg-ink-line">
            <motion.div style={{ width: progress }} className="h-full bg-signal" />
          </div>
        </div>
      </div>

      {/* Mobile / tablet: stacked */}
      <div className="flex flex-col gap-12 py-24 lg:hidden">
        {intro}
        <ol className="container grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 2) * 0.08}>
              <StepCard step={s} index={i} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
