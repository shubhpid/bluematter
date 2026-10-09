import { motion } from "framer-motion";
import { CountUp, EASE, Reveal, SplitWords } from "./motion";

const stats = [
  { value: 2.75, decimals: 2, prefix: "$", suffix: "B", label: "Global BCI market", note: "2026 valuation" },
  { value: 61.7, decimals: 1, prefix: "", suffix: "%", label: "Non-invasive share", note: "Of total market" },
  { value: 40.8, decimals: 1, prefix: "", suffix: "%", label: "North America", note: "Regional share" },
  { value: 15, decimals: 0, prefix: "", suffix: "%", label: "Annual growth", note: "Projected CAGR" },
];

const rows = [
  { category: "Price", clinical: "$10,000–$30,000", commercial: "~$3,000", bluematter: "~$400" },
  { category: "Wireless", clinical: "No (wired)", commercial: "Yes", bluematter: "Yes (Bluetooth)" },
  { category: "Invasive", clinical: "Often yes", commercial: "No", bluematter: "No" },
  { category: "Signal fidelity", clinical: "Very high", commercial: "Low–medium", bluematter: "High (AI-enhanced)" },
  { category: "Form factor", clinical: "Bulky headset", commercial: "Headband", bluematter: "Baseball cap" },
  { category: "Electrode count", clinical: "64–256", commercial: "4–8", bluematter: "20+ (expandable)" },
];

export default function MarketSection() {
  return (
    <section id="market" aria-labelledby="market-title" className="px-2 md:px-6">
      <div className="rounded-lg bg-paper py-24 text-paper-ink md:py-32">
        <div className="container flex flex-col gap-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div className="flex flex-col gap-6">
              <h2 id="market-title" className="type-h2 text-balance text-4xl md:text-6xl">
                <SplitWords text="A fast-growing market, ready for a better device." />
              </h2>
            </div>
            <Reveal delay={0.1}>
              <p className="max-w-lg text-pretty text-lg leading-relaxed text-slate">
                Advances in neuroscience and AI are driving demand for seamless human-machine interaction.
                Non-invasive devices dominate and North America leads adoption &mdash; placing BlueMatter at the
                center of the growth.
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal
                as="li"
                key={s.label}
                delay={i * 0.08}
                className="flex flex-col gap-2 rounded-lg border border-paper-line bg-paper p-6 transition-shadow duration-500 hover:shadow-[0_20px_60px_-30px_rgba(8,16,32,0.35)]"
              >
                <span className="type-h1 text-5xl">
                  <CountUp to={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                </span>
                <span className="mt-4 text-sm font-semibold">{s.label}</span>
                <span className="text-sm text-slate">{s.note}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <div className="overflow-x-auto rounded-lg border border-paper-line">
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Comparison of clinical, commercial, and BlueMatter BCI devices</caption>
                <thead>
                  <tr className="border-b border-paper-line">
                    <th scope="col" className="px-6 py-4 font-semibold text-slate">
                      Feature
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate">
                      Clinical
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate">
                      Commercial
                    </th>
                    <th scope="col" className="bg-signal-wash px-6 py-4 font-bold text-signal-deep">
                      BlueMatter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <motion.tr
                      key={r.category}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                      className="border-b border-paper-line last:border-0"
                    >
                      <th scope="row" className="px-6 py-4 font-semibold">
                        {r.category}
                      </th>
                      <td className="px-6 py-4 text-slate">{r.clinical}</td>
                      <td className="px-6 py-4 text-slate">{r.commercial}</td>
                      <td className="bg-signal-wash px-6 py-4 font-semibold text-signal-deep">{r.bluematter}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
