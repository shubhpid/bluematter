import { motion, useReducedMotion } from "framer-motion";
import AffiliationMarquee from "./AffiliationMarquee";
import BrainCard from "./BrainCard";
import { EASE, SplitWords } from "./motion";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="flex min-h-[100svh] flex-col px-2 pb-2 pt-20 md:h-[100svh] md:min-h-[560px] md:px-6 md:pb-6">
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-paper text-paper-ink">
        <div className="grid-lines-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="container relative grid min-h-0 flex-1 gap-8 py-8 md:grid-cols-[1fr_1.1fr] md:grid-rows-[minmax(0,1fr)] md:gap-10 md:py-6">
          <div className="flex flex-col justify-center gap-10">
            <h1 className="type-h1 text-balance text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              <SplitWords text="Your thoughts," immediate delay={0.15} />
              <br />
              <SplitWords text="wirelessly connected." immediate delay={0.35} className="text-signal-deep" />
            </h1>

            <motion.a
              href="#intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
              className="hidden w-fit items-center gap-3 text-sm font-semibold text-slate transition-colors hover:text-paper-ink md:inline-flex"
            >
              <span className="flex h-9 w-5 justify-center rounded-full border border-paper-line pt-1.5">
                <motion.span
                  className="size-1.5 rounded-full bg-signal-deep"
                  animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              Scroll to explore
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            className="h-[22rem] sm:h-[26rem] md:h-full"
          >
            <BrainCard className="h-full w-full" />
          </motion.div>
        </div>

        <AffiliationMarquee />
      </div>
    </section>
  );
}
