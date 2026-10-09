import { CountUp, Eyebrow, Reveal, SplitWords } from "./motion";

const metrics = [
  { value: 400, prefix: "~$", suffix: "", label: "Target device cost", note: "vs. $10k+ clinical" },
  { value: 20, prefix: "", suffix: "+", label: "Electrodes", note: "Full head coverage" },
  { value: 100, prefix: "", suffix: "%", label: "Wireless", note: "Bluetooth, battery-powered" },
  { value: 0, prefix: "", suffix: "", label: "Surgery required", note: "Completely non-invasive" },
];

export default function VisionSection() {
  return (
    <section aria-labelledby="vision-title" className="px-2 md:px-6">
      <div className="relative overflow-hidden rounded-lg bg-paper py-24 text-paper-ink md:py-32">
        <div className="container flex flex-col gap-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div className="flex flex-col gap-6">
              <Reveal>
                <Eyebrow tone="light">Our vision</Eyebrow>
              </Reveal>
              <h2 id="vision-title" className="type-h2 text-balance text-5xl md:text-7xl">
                <SplitWords text="BCI for everyone." />
              </h2>
            </div>
            <Reveal delay={0.1}>
              <p className="max-w-lg text-pretty text-lg leading-relaxed text-slate">
                We are pioneering practical, non-invasive brain-computer interfaces for consumer applications &mdash;
                designed to be worn all day, priced for real people, and capable enough to control the world around
                you.
              </p>
            </Reveal>
          </div>

          <ul className="grid grid-cols-2 border-t border-paper-line lg:grid-cols-4">
            {metrics.map((m, i) => (
              <Reveal
                as="li"
                key={m.label}
                delay={i * 0.08}
                className={`flex flex-col gap-2 border-paper-line py-8 pr-6 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${
                  i % 2 === 1 ? "border-l pl-6" : ""
                } ${i >= 2 ? "border-t lg:border-t-0" : ""}`}
              >
                <span className="type-h1 text-5xl text-paper-ink md:text-6xl">
                  <CountUp to={m.value} prefix={m.prefix} suffix={m.suffix} />
                </span>
                <span className="text-sm font-semibold">{m.label}</span>
                <span className="text-sm text-slate">{m.note}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
