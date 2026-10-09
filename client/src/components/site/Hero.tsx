import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import EegTrace from "./EegTrace";
import { EASE, Eyebrow, SplitWords } from "./motion";

const annotations = [
  { label: "Electrodes", value: "20+ channels", className: "left-4 top-4 md:left-8 md:top-8" },
  { label: "Link", value: "Bluetooth LE", className: "right-4 top-4 md:right-8 md:top-8" },
  { label: "Form factor", value: "Baseball cap", className: "bottom-24 left-4 hidden sm:flex md:bottom-28 md:left-8" },
];

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.9, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="top" className="px-2 pt-20 md:px-6">
      <div className="relative overflow-hidden rounded-lg bg-paper text-paper-ink">
        <div className="grid-lines-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

        <div className="container relative flex flex-col items-center pt-20 pb-16 text-center md:pt-28 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="rounded-full border border-paper-line bg-paper px-4 py-1.5"
          >
            <Eyebrow tone="light">Non-invasive BCI &middot; Wireless EEG</Eyebrow>
          </motion.div>

          <h1 className="type-h1 mt-8 max-w-5xl text-balance text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            <SplitWords text="Your thoughts," immediate delay={0.15} />
            <br />
            <SplitWords text="wirelessly connected." immediate delay={0.35} className="text-signal-deep" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-slate md:text-lg"
          >
            BlueMatter is a discreet wireless EEG system hidden inside a baseball cap &mdash; clinical-grade signal
            acquisition with consumer-friendly design, seamlessly connected to your world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#technology"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-paper-ink px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-signal-deep"
            >
              Explore the technology
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#team"
              className="inline-flex items-center justify-center rounded-md border border-paper-line bg-paper px-6 py-3.5 text-sm font-semibold text-paper-ink transition-colors hover:border-paper-ink"
            >
              Meet the team
            </a>
          </motion.div>
        </div>

        <div className="container relative pb-6 md:pb-10">
          <motion.div
            ref={cardRef}
            style={{ scale }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink sm:aspect-[16/10] md:aspect-[16/8]"
          >
            <motion.img
              src="/images/hero-cap.png"
              alt="BlueMatter EEG electrodes integrated into a navy baseball cap, shown on a mannequin"
              style={{ y: imgY }}
              className="absolute inset-0 h-[112%] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

            {annotations.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 1.2 + i * 0.15, ease: EASE }}
                className={`absolute flex flex-col rounded-md border border-ink-line bg-ink/70 px-3 py-2 text-left backdrop-blur-md ${a.className}`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-light">{a.label}</span>
                <span className="text-sm font-semibold text-paper">{a.value}</span>
              </motion.div>
            ))}

            <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-4 md:p-8">
              <div className="flex shrink-0 flex-col gap-1">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-signal">
                  <span className="size-1.5 rounded-full bg-signal" />
                  Live
                </span>
                <span className="text-xs text-slate-light">CH 01&ndash;04</span>
              </div>
              <EegTrace className="h-16 w-full md:h-20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
