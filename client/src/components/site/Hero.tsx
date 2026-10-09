import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AffiliationMarquee from "./AffiliationMarquee";

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

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative h-[140svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col px-2 pb-2 pt-20 md:px-6 md:pb-6">
        <motion.div
          style={reduce ? undefined : { scale: cardScale, opacity: cardOpacity }}
          className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-paper text-paper-ink"
        >
          <div className="grid-lines-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

          <div className="container relative flex flex-1 items-center justify-center">
            <motion.h1
              style={reduce ? undefined : { y: textY, opacity: textOpacity, filter }}
              className="type-h1 mx-auto max-w-6xl text-balance text-center text-4xl leading-[1.08] sm:text-5xl md:text-6xl xl:text-7xl"
            >
              Your thoughts, wirelessly and instantly connected to <span className="text-signal-deep">everything you own.</span>
            </motion.h1>
          </div>

          <AffiliationMarquee />
        </motion.div>
      </div>
    </section>
  );
}
