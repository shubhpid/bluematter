import BentoRail, { type BentoItem } from "./BentoRail";
import { Reveal, SplitWords } from "./motion";

const useCases: BentoItem[] = [
  {
    title: "Prosthetic control",
    desc: "Precise, intuitive control of prosthetic limbs through thought-based commands — restoring independence and mobility.",
    image: "/images/bento/prosthetic.png",
    alt: "Robotic prosthetic hand reaching for a glass",
  },
  {
    title: "Mental health monitoring",
    desc: "Continuous, non-invasive monitoring of neurological patterns to catch early signs of anxiety and depression.",
    image: "/images/bento/mental-health.png",
    alt: "Translucent glass head with a calm pulse line flowing through it",
  },
  {
    title: "Smart home control",
    desc: "Hands-free control of lights, thermostats, and entertainment through discreet neural commands.",
    image: "/images/bento/smart-home.png",
    alt: "Dim modern living room with a glowing blue pendant lamp",
  },
  {
    title: "Immersive gaming",
    desc: "Gameplay your thoughts directly influence — a new dimension of player immersion.",
    image: "/images/bento/gaming.png",
    alt: "Game controller dissolving into glowing neural particles",
  },
  {
    title: "Cognitive enhancement",
    desc: "Real-time neurofeedback for focus training, meditation guidance, and performance.",
    image: "/images/bento/cognitive.png",
    alt: "Glass sphere with concentric glowing ripples",
  },
  {
    title: "Robotic teleoperation",
    desc: "Remote control of robotic systems for hazardous environments, surgical assistance, and industry — directed by thought.",
    image: "/images/bento/robotics.png",
    alt: "Industrial robotic arm with blue accent lights",
  },
];

export default function ApplicationsSection() {
  return (
    <section id="applications" aria-labelledby="applications-title" className="flex flex-col gap-14 py-24 md:py-32">
      <div className="container flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="applications-title" className="type-h2 max-w-3xl text-balance text-4xl text-paper md:text-6xl">
          <SplitWords text="One interface. Endless possibilities." />
        </h2>
        <Reveal delay={0.1}>
          <p className="max-w-md text-pretty text-lg leading-relaxed text-slate-light">
            From healthcare to entertainment, BlueMatter opens new frontiers in human-machine interaction.
          </p>
        </Reveal>
      </div>
      <BentoRail items={useCases} label="Applications" />
    </section>
  );
}
