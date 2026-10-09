/**
 * Archived: the cap-on-mannequin product panel that used to sit under the hero headline.
 * Not currently rendered. Import it anywhere to bring it back.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import EegTrace from "../EegTrace";
import { EASE } from "../motion";

const annotations = [
  { label: "Electrodes", value: "20+ channels", className: "left-4 top-4 md:left-8 md:top-8" },
  { label: "Link", value: "Bluetooth LE", className: "right-4 top-4 md:right-8 md:top-8" },
  { label: "Form factor", value: "Baseball cap", className: "bottom-24 left-4 hidden sm:flex md:bottom-28 md:left-8" },
];

export default function HeroProductPanel() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.9, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
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
  );
}
