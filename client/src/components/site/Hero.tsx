import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AffiliationMarquee from "./AffiliationMarquee";
import { EASE, SplitWords } from "./motion";

/** scale.com-style opener: a single sentence that lifts away as the reader starts scrolling. */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const textY = useTransform(scrollYProgress, [0, 0.7], [0, -140]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.6], [1, 0]);
  const textBlur = useTransform(scrollYProgress, [0.1, 0.6], [0, 10]);
  const filter = useMotionTemplate`blur(${textBlur}px)`;
  const cardScale = useTransform(scrollYProgress, [0.35, 1], [1, 0.92]);
  const cardOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0.35]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative h-[170svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col px-2 pb-2 pt-20 md:px-6 md:pb-6">
        <motion.div
          style={reduce ? undefined : { scale: cardScale, opacity: cardOpacity }}
          className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-paper text-paper-ink"
        >
          <div className="grid-lines-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

          <div className="container relative flex flex-1 items-center">
            <motion.h1
              style={reduce ? undefined : { y: textY, opacity: textOpacity, filter }}
              className="type-h1 max-w-6xl text-balance text-4xl leading-[1.08] sm:text-5xl md:text-6xl xl:text-7xl"
            >
              <SplitWords text="Your thoughts, wirelessly and instantly connected to" immediate delay={0.15} stagger={0.05} />
              <br />
              <SplitWords text="everything you own." immediate delay={0.6} className="text-signal-deep" />
            </motion.h1>
          </div>

          <motion.a
            href="#playground"
            style={{ opacity: cueOpacity }}
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
            className="container relative hidden items-center gap-3 pb-6 text-sm font-semibold text-slate transition-colors hover:text-paper-ink md:flex"
          >
            <span className="flex h-9 w-5 justify-center rounded-full border border-paper-line pt-1.5">
              <motion.span
                className="size-1.5 rounded-full bg-signal-deep"
                animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            Scroll
          </motion.a>

          <AffiliationMarquee />
        </motion.div>
      </div>
    </section>
  );
}
