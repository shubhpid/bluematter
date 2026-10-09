import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const statement =
  "BlueMatter is a discreet wireless EEG system hidden inside a baseball cap. You'll get clinical-grade signal acquisition with consumer-friendly design, seamlessly connected to your world.";
const accent = new Set(["baseball", "cap", "clinical-grade", "consumer-friendly"]);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${accent.has(word.replace(/[.,]$/, "")) ? "text-signal" : ""}`}>
      {word}&nbsp;
    </motion.span>
  );
}

/** Scroll-scrubbed statement: words light up as the reader moves through the section. */
export default function StatementSection() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = statement.split(" ");

  return (
    <section id="intro" aria-label="About BlueMatter" className="py-32 md:py-44">
      <div className="container">
        <p ref={ref} className="max-w-5xl text-pretty text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
          {words.map((w, i) => (
            <Word key={`${w}-${i}`} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>
      </div>
    </section>
  );
}
