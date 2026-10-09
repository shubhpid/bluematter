import BrainCard from "./BrainCard";
import { Reveal, SplitWords } from "./motion";
import NeuralField from "./NeuralField";
import ThoughtAscii from "./ThoughtAscii";

/** Interactive sandbox right after the hero: the ASCII brain, a reactive neural field and a word decoder. */
export default function PlaygroundSection() {
  return (
    <section id="playground" aria-labelledby="playground-title" className="relative overflow-hidden py-24 md:py-32">
      <NeuralField className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      <div className="container relative flex flex-col gap-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 id="playground-title" className="type-h2 max-w-2xl text-balance text-4xl text-paper md:text-5xl">
            <SplitWords text="Go on, play with a brain." />
          </h2>
          <Reveal delay={0.15}>
            <p className="max-w-md text-pretty leading-relaxed text-slate-light">
              Drag to spin it. Shake it hard enough and find out what happens. Click anywhere in the field to send a
              pulse through it.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Reveal y={40}>
            <BrainCard className="h-[26rem] w-full sm:h-[32rem] lg:h-[36rem]" />
          </Reveal>
          <Reveal y={40} delay={0.1}>
            <ThoughtAscii />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
