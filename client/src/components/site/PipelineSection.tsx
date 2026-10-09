import BentoRail, { type BentoItem } from "./BentoRail";
import { Reveal, SplitWords } from "./motion";

const steps: BentoItem[] = [
  {
    tag: "Stage 1",
    title: "Signal acquisition",
    desc: "Raw EEG captured from 20+ electrodes across the scalp, alongside accelerometer data for motion tracking.",
    image: "/images/bento/acquisition.png",
    alt: "Glowing electrode array on a curved scalp surface",
  },
  {
    tag: "Stage 2",
    title: "Artifact removal",
    desc: "Accelerometer-enhanced motion artifact removal filters environmental noise out of the raw brain signals.",
    image: "/images/bento/artifact.png",
    alt: "Noisy waveform passing through a glass filter and emerging clean",
  },
  {
    tag: "Stage 3",
    title: "Filter & normalize",
    desc: "Advanced filtering and normalization with eye-artifact detection produce clean, usable data.",
    image: "/images/bento/normalize.png",
    alt: "Neatly aligned stacked signal ribbons",
  },
  {
    tag: "Stage 4",
    title: "Brain mapping",
    desc: "A novel self-organizing map generates a spatial brain map using topographically inspired techniques.",
    image: "/images/bento/mapping.png",
    alt: "Hexagonal self-organizing map shaped like a brain topography",
  },
  {
    tag: "Stage 5",
    title: "Neural classification",
    desc: "A custom spiking graph convolution neural network learns from the brain map to classify intended actions.",
    image: "/images/bento/classify.png",
    alt: "Graph neural network with light pulses traveling along edges",
  },
  {
    tag: "Stage 6",
    title: "Action output",
    desc: "Predicted intentions are sent over Bluetooth to control connected devices in real time.",
    image: "/images/bento/output.png",
    alt: "Wireless signal arcs radiating from a small module to devices",
  },
];

export default function PipelineSection() {
  return (
    <section id="pipeline" aria-labelledby="pipeline-title" className="flex flex-col gap-14 py-24 md:py-32">
      <div className="container flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="pipeline-title" className="type-h2 max-w-2xl text-balance text-4xl text-paper md:text-6xl">
          <SplitWords text="From raw signal to intent." />
        </h2>
        <Reveal delay={0.1}>
          <p className="max-w-md text-pretty leading-relaxed text-slate-light">
            Proven signal-processing techniques combined in a never-before-seen way to pull high-quality data out of a
            chaotic, noisy environment &mdash; and classify it in real time.
          </p>
        </Reveal>
      </div>
      <BentoRail items={steps} label="Signal processing pipeline stages" />
    </section>
  );
}
